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