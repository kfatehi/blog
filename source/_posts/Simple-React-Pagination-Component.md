---
title: A simple React pagination component
date: 2016-12-29 11:08:43
tags:
- react
- javascript
---

I had to do pagination in a react app today. Often times for things like this, it's easier to write your own thing than to use a library. Here's the Pager component I ended up with:

**Pager.jsx**

```jsx
import React from 'react';

export const Pager = React.createClass({
  render: function() {
    const  {
      perPage,
      totalRows,
      pageNumber,
      lastPageNumber,
      query
    } = this.props;
    const checkDisabled = (change) => {
      let newPage = pageNumber+change;
      if ( newPage < 1 ) return true;
      if ( newPage > lastPageNumber ) return true;
      return false
    }
    const jumpToPage = (pageNo) => query({ perPage, showPageNumber: pageNo });
    const changePage = (change) => (event) => jumpToPage(pageNumber+change);
    return <span>
      <span className="total">
        total {totalRows} #{((pageNumber-1)*perPage) + 1}
      </span>
      <span className="pager">
        <button disabled={checkDisabled(-1)} onClick={changePage(-1)}>prev</button>
        <select value={pageNumber} onChange={({target:{value}})=>jumpToPage(value)}>
          { Array(lastPageNumber).fill().map((_,i)=><option key={i} value={i+1}>
            page: {i+1}/{lastPageNumber}
          </option>)}
        </select>
        <button disabled={checkDisabled(1)} onClick={changePage(1)}>next</button>
      </span>
    </span>;
  }
})
```

This pager component calls the `query` prop function (a redux action, say) in response to previous and next buttons, and direct page selection, with an object like so `{ perPage: 10, showPageNumber: 1 }`

Naturally, this being react, how this is used and what `query` does is out of scope, unknown and irrelevant, but here's a little screenshot of the UI in which this is being used, for kicks:


{% asset_img pager.png pager screenshot %}
