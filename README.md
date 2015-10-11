This is the source of my personal website [http://keyvanfatehi.com/](keyvanfatehi.com).  The only interesting branch in this repo will be the *source* branch as GitHub expects the generated website to live in *master*.

Steps to publish:

* Make changes in the *source* branch while running `./serve` which builds on every change
* Commit changes to *source* branch and push
* Publish by executing `./publish`

## Publish

The publish script consists of the following steps
- Build & Autocommit
- `git branch -D master`
- `git checkout -b master`
- `git filter-branch --subdirectory-filter _site/ -f`
- `git checkout source`
- `git push --all origin`
