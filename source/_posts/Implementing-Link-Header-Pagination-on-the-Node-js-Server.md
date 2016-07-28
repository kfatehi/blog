---
title: Implementing Link Header Pagination on the Node.js Server
date: 2016-07-27 20:50:33
tags:
- nodejs
- javascript
---

In the past few years, more and more APIs have begun to follow the [RFC5988 convention](https://tools.ietf.org/html/rfc5988) of using the `Link` header to provide URLs for the next page. We can do this too and it's quite easy.

Here is a function I recently wrote to do this for the simple case of a big array:

```javascript
function paginate(sourceList, page, perPage) {
  var totalCount = sourceList.length;
  var lastPage = Math.floor(totalCount / perPage);
  var sliceBegin = page*perPage;
  var sliceEnd = sliceBegin+perPage;
  var pageList = sourceList.slice(sliceBegin, sliceEnd);
  return {
    pageData: pageList,
    nextPage: page < lastPage ? page+1 : null,
    totalCount: totalCount
  }
}
```

To demonstrate the usage, imagine you have defined a function `getMovies` which provides a `movieList` array you wish to paginate.
You have an express route `/movies` which serves as the web API to your movie library.
You might create a paginated route like this:

```javascript
app.get('/movies', function(req, res) {
  var pageNum = parseInt(req.query.page || 0);
  var perPage = parseInt(req.query.per_page || 50);
  getMovies(function(err, movieList) {
    if (err) throw err;
    var page = paginate(movieList, pageNum, perPage);
    if (page.nextPage) {
      res.set("Link", "/movies?page="+page.nextPage);
    }
    res.set("X-Total-Count", movieList.length);
    res.json(page.pageData);
  });
})
```

Note that in most cases, you would not be paginating from a big array. This was my first time paginating a fairly large set which was not from a database. In the case of database access, your function won't be so general since it will depend on using the database API to create an efficient query by offset and limit.
