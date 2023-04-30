import React from 'react';
import './App.scss';
import {Player, Sidebar} from "./components";
import {Provider} from "react-redux";
import {store} from "./store/store";
import {fetchQueuePage} from "./store/queue/queue.reducer";
import {BaseLayout} from "./components/layouts/BaseLayout";
import {init} from "./store/player/player.reducer";

function App() {
    if (!store.getState().queue.isFetching) {
        store.dispatch(fetchQueuePage())
    }
    setTimeout(() => {
        store.dispatch(init({queueSize: store.getState().queue.totalTracks!}))
    })
  return (
      <Provider store={store}>
          {/*<div className="flex justify-between h-screen">*/}

          {/*    <div style={{width: '250px'}}>*/}
          {/*        <Sidebar />*/}
          {/*    </div>*/}

          {/*    <div style={{width: '400px', maxHeight: '100%', overflow: 'hidden'}}>*/}
          {/*        <Player />*/}
          {/*    </div>*/}
          {/*</div>*/}

          <BaseLayout />
      </Provider>
  );
}


export default App;
