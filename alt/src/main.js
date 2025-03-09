import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Oruga from '@oruga-ui/oruga-next';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faUser, 
  faSignOutAlt, 
  faRunning, 
  faUtensils, 
  faUsers, 
  faCog, 
  faPlus, 
  faEdit, 
  faTrash,
  faSearch,
  faChartBar,
  faCalendarAlt,
  faHeart,
  faHeartBroken,
  faCheck,
  faTimes,
  faHome,
  faEnvelope,
  faLock,
  faUserPlus,
  faUserMinus,
  faUserCircle,
  faUserFriends,
  faSpinner,
  faBicycle,
  faSwimmer,
  faWalking,
  faHiking,
  faDumbbell,
  faOm,
  faStar,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

// Add FontAwesome icons
library.add(
  faUser, 
  faSignOutAlt, 
  faRunning, 
  faUtensils, 
  faUsers, 
  faCog, 
  faPlus, 
  faEdit, 
  faTrash,
  faSearch,
  faChartBar,
  faCalendarAlt,
  faHeart,
  faHeartBroken,
  faCheck,
  faTimes,
  faHome,
  faEnvelope,
  faLock,
  faUserPlus,
  faUserMinus,
  faUserCircle,
  faUserFriends,
  faSpinner,
  faBicycle,
  faSwimmer,
  faWalking,
  faHiking,
  faDumbbell,
  faOm,
  faStar,
  faArrowRight
);

const app = createApp(App);

// Use plugins
app.use(router);
app.use(store);
app.use(Oruga);

// Register FontAwesome component
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
