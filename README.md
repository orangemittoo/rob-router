rob-router
====

## Overview
For non-SPA (non-SPA) client side routers for WEB applications similar to Rails routers.

## Description
Define the routes file just like Rails,
The controller matching the URL is executed.

## Usage

### Install

```
npm install rob-router
```

### Demo

```
# routes
import RobRouter from 'rob-router';
import users from './users_controller';

const router = new RobRouter({
  controllers: {
    users
  },
  routes: {
    '/': 'users#root',
    'users(/)': 'users#index',
    'users/:userId': 'users#show',
    'users/:userId/posts(/)': 'users#posts',
    'users/:userId/posts/:postId(/)': 'users#postShow'
  }
});

router.run(location.href);

# user_controller
export default {
  root: () => {
    alert('root');
  },
  index: () => {
    alert('index');
  },
  show: userId => {
    alert(`show:${userId}`);
  },
  posts: userId => {
    alert(`posts:${userId}`);
  },
  postShow: (userId, postId) => {
    alert(`posts:${userId}:${postId}`);
  }
};
```

## Licence

[MIT](https://github.com/tcnksm/tool/blob/master/LICENCE)

## Author

[tcnksm](https://github.com/orangemittoo)