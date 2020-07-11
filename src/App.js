import React from 'react';
import { Switch, Route } from 'react-router-dom';

import PostList from './Containers/PostList/PostList';
import Post from './Containers/PostList/Post/Post';
import CreatePost from './Containers/CreatePost/CreatePost';
import Auth from './Containers/Auth/Auth';
import './App.css';

const App = (props) => {
  return (
    <div className="App">
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
    </div>
  );
}

export default App;
