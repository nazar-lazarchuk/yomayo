import jsx from 'yomayo/jsx';
import { createApp } from 'yomayo';

import { store } from './store.js';

import { Document, App as AppComponent } from './components';

export default createApp(store)(<Document App={AppComponent} />)
