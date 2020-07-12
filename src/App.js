import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import Spinner from './Components/UI/Spinner/Spinner';

import './App.css';

const App = (props) => {

  const Post = lazy(() => import('./Containers/PostList/Post/Post'));
  const PostList = lazy(() => import('./Containers/PostList/PostList'));
  const CreatePost = lazy(() => import('./Containers/CreatePost/CreatePost'));
  const Auth = lazy(() => import('./Containers/Auth/Auth'));

  return (
    <div className="App">
      <Suspense fallback={<Spinner/>}>
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
          <Route path="/posts/category/:categoryId">
            <PostList />
          </Route>
          <Route exact path="/posts">
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
