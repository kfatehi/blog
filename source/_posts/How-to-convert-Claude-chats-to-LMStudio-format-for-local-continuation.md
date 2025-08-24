---
title: How to convert Claude chats to LMStudio format for local continuation
date: 2025-08-24 10:26:17
tags:
- ai
excerpt: Python script to convert your Anthropic/Claude data export to a popular local LLM engine
---

If you're using [Anthropic's Claude](https://www.anthropic.com/) and want to bring your chat history into a local LLM environment like [LMStudio](https://lmstudio.ai/), [this python script](https://github.com/kfatehi/anthropic-to-lm-studio) helps with the conversion process.

## Why convert?  
LMStudio allows you to run large language models locally, enabling private conversations and continued dialogue without relying on cloud services. By converting your Claude export files (`conversations.json`) into LMStudio's `.conversation.json` format, you can seamlessly transfer your chat history for use in local AI workflows.  

## How it works  
The script:  
1. Reads your Anthropic export file  
2. Converts timestamps and message formats  
3. Outputs individual `.conversation.json` files  
4. Preserves conversation context for LMStudio  

## Guide

### Open the sidebar

{% asset_img 1.png %}

### Click your name

{% asset_img 2.png %}

### Click settings

{% asset_img 3.png %}

### Click privacy

{% asset_img 4.png %}

### Scroll to the bottom and click on "Export data"

{% asset_img 5.png %}

### Find the archive link in your email

{% asset_img 6.png %}

### Extract the archive and use the script

```python
#!/usr/bin/env python3
"""
anthropic_to_lmstudio.py

Converts an Anthropic export (conversations.json) into a set of LMStudio
conversation files.

Usage:
    python anthropic_to_lmstudio.py --input path/to/conversations.json \
                                    --output-dir ./lmstudio_convos

The output will contain one .conversation.json file per conversation,
named <epoch_ms>.conversation.json. Empty conversations are ignored.
"""

import json
import argparse
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict, Any


def iso_to_epoch_ms(iso_str: str) -> int:
    """Convert an ISO‑8601 timestamp (with trailing Z) to Unix epoch in ms."""
    # Example input: 2025-02-25T23:36:44.672658Z
    dt = datetime.fromisoformat(iso_str.replace("Z", "+00:00"))
    return int(dt.timestamp() * 1000)


def build_lmstudio_conversation(convo: Dict[str, Any]) -> Dict[str, Any]:
    """
    Build a minimal LMStudio conversation dict from an Anthropic conversation.
    """
    # Basic metadata
    created_at_ms = iso_to_epoch_ms(convo["created_at"])
    name = convo.get("name") or f"Conversation {created_at_ms}"
    messages: List[Dict[str, Any]] = []

    for msg in convo.get("chat_messages", []):
        role = msg["sender"]  # "human" or "assistant"

        # The Anthropic export stores the actual text inside `content[0].text`.
        # Some messages may be empty – skip them.
        content_text = ""
        if msg.get("content"):
            for part in msg["content"]:
                if part["type"] == "text":
                    content_text += part["text"]
        if not content_text.strip():
            continue

        if role == "human":
            # LMStudio expects a *singleStep* message with role = user
            messages.append(
                {
                    "versions": [
                        {
                            "type": "singleStep",
                            "role": "user",
                            "content": [{"type": "text", "text": content_text}],
                        }
                    ],
                    "currentlySelected": 0,
                }
            )
        elif role == "assistant":
            # LMStudio expects a *multiStep* message with role = assistant
            messages.append(
                {
                    "versions": [
                        {
                            "type": "multiStep",
                            "role": "assistant",
                            "senderInfo": {"senderName": convo["account"]["uuid"]},
                            "steps": [
                                {
                                    "type": "contentBlock",
                                    "stepIdentifier": f"{created_at_ms}-{hash(content_text) % 1_000_000}",
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": content_text,
                                            "fromDraftModel": False,
                                            "tokensCount": None,  # optional
                                            "isStructural": False,
                                        }
                                    ],
                                    "defaultShouldIncludeInContext": True,
                                    "shouldIncludeInContext": True,
                                }
                            ],
                        }
                    ],
                    "currentlySelected": 0,
                }
            )
        else:
            # Ignore unknown roles (e.g. tool messages)
            continue

    if not messages:
        return None  # skip empty conversations

    lm_convo = {
        "name": name,
        "pinned": False,
        "createdAt": created_at_ms,
        "preset": "",
        "tokenCount": 0,  # optional
        "systemPrompt": "",
        "messages": messages,
        "usePerChatPredictionConfig": True,
        "perChatPredictionConfig": {"fields": []},
        "clientInput": "",
        "clientInputFiles": [],
        "userFilesSizeBytes": 0,
        "lastUsedModel": {
            "indexedModelIdentifier": "openai/gpt-oss-20b",
            "identifier": "openai/gpt-oss-20b",
            "instanceLoadTimeConfig": {"fields": []},
            "instanceOperationTimeConfig": {"fields": []},
        },
        "notes": [],
        "plugins": [],
        "pluginConfigs": {},
        "disabledPluginTools": [],
        "looseFiles": [],
    }

    return lm_convo


def main():
    parser = argparse.ArgumentParser(description="Anthropic → LMStudio converter")
    parser.add_argument(
        "--input",
        "-i",
        required=True,
        help="Path to the Anthropic conversations.json file",
    )
    parser.add_argument(
        "--output-dir",
        "-o",
        default="./lmstudio_convos",
        help="Directory where .conversation.json files will be written",
    )

    args = parser.parse_args()

    # Load the Anthropic export
    with open(args.input, "r", encoding="utf-8") as f:
        anth_convs = json.load(f)

    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    for convo in anth_convs:
        lm_convo = build_lmstudio_conversation(convo)
        if lm_convo is None:
            continue  # skip empty

        filename = f"{iso_to_epoch_ms(convo['created_at'])}.conversation.json"
        out_path = out_dir / filename
        with open(out_path, "w", encoding="utf-8") as out_f:
            json.dump(lm_convo, out_f, indent=2)
        print(f"Written {out_path}")

    print("Conversion complete.")


if __name__ == "__main__":
    main()
```