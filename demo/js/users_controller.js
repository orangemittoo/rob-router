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
