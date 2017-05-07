import test from 'ava';
import Router from '../src/routes-on-browser';

let router;
let users;
test.beforeEach(() => {
  users = {
    root: () => {
      return 'root';
    },
    index: () => {
      return 'index';
    },
    show: userId => {
      return `show:${userId}`;
    },
    posts: userId => {
      return `posts:${userId}`;
    },
    postShow: (userId, postId) => {
      return `posts:${userId}:${postId}`;
    }
  };

  router = new Router({
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
});

test('constructor: error', t => {
  let error = t.throws(() => {
    /* eslint-disable no-new */
    new Router();
    /* eslint-enable no-new */
  });
  t.is(error.message, 'Controller parameters are required.');

  error = t.throws(() => {
    /* eslint-disable no-new */
    new Router({
      controllers: {
        users
      }
    });
    /* eslint-enable no-new */
  });
  t.is(error.message, 'Routes parameters are required.');

  error = t.throws(() => {
    /* eslint-disable no-new */
    new Router({
      routes: {}
    });
    /* eslint-enable no-new */
  });
  t.is(error.message, 'Controller parameters are required.');

  error = t.throws(() => {
    /* eslint-disable no-new */
    new Router({
      controllers: {
        users
      },
      routes: {
        users: ''
      }
    });
    /* eslint-enable no-new */
  });
  t.is(error.message, 'Routes value is invalid.');

  error = t.throws(() => {
    /* eslint-disable no-new */
    new Router({
      controllers: {
        users
      },
      routes: {
        users: 'foo'
      }
    });
    /* eslint-enable no-new */
  });
  t.is(error.message, 'Routes value is invalid.');

  error = t.throws(() => {
    /* eslint-disable no-new */
    new Router({
      controllers: {
        users
      },
      routes: {
        users: 'users#bar'
      }
    });
    /* eslint-enable no-new */
  });
  t.is(error.message, 'Routes value is invalid.');
});

test('router.run: /', t => {
  t.is(router.run('http://example.com'), 'root');
  t.is(router.run('http://example.com/'), 'root');
});

test('router.run: /users', t => {
  t.is(router.run('http://example.com/users'), 'index');
  t.is(router.run('http://example.com/users/'), 'index');
});

test('router.run: /users/:userId', t => {
  t.is(router.run('http://example.com/users/1'), 'show:1');
  t.is(router.run('http://example.com/users/1/'), undefined);
});

test('router.run: /users/:userId/posts', t => {
  t.is(router.run('http://example.com/users/10/posts'), 'posts:10');
  t.is(router.run('http://example.com/users/10/posts/'), 'posts:10');
});

test('router.run: /users/:userId/posts/:postId', t => {
  t.is(router.run('http://example.com/users/100/posts/200'), 'posts:100:200');
  t.is(router.run('http://example.com/users/100/posts/200/'), 'posts:100:200');
});
