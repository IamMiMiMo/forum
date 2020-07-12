import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import './App.css';

const App = (props) => {

  const Post = lazy(() => import('./Containers/PostList/Post/Post'));
  const PostList = lazy(() => import('./Containers/PostList/PostList'));
  const CreatePost = lazy(() => import('./Containers/CreatePost/CreatePost'));
  const Auth = lazy(() => import('./Containers/Auth/Auth'));

  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path="/post/:id">
            <Post />
          </Route>
          <Route path="/new">
            <CreatePost />
          </Route>
          <Route path="/auth">
            <Auth />
          </Route>
          <Route path="/posts">
            <PostList />
          </Route>
          <Route>
            <PostList />
          </Route>
        </Switch>
      </Suspense>
    </div>
  );
}

export default App;
