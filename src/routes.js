// import Dashboard from "@material-ui/icons/Dashboard";
import CompanyAdmin from 'views/Users/CompanyAdmin';
import Companies from "views/Companies";
import { Business, Group } from "@material-ui/icons";
import EntriesPage from "views/Entries";
import ScoreBoardPage from "views/ScoreBoard";
import EntriesView from "views/Entries/view";
import RadarEntries from "views/Entries/radar";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import PageviewIcon from '@material-ui/icons/Pageview';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import DirectionsIcon from '@material-ui/icons/Directions';

// const { authUser } = useAuth();
 const dashboardRoutes =  [
  // {
  //   collapse: true,
  //   name: "Samples",
  //   rtlName: "صفحات",
  //   icon: Apps,
  //   state: "sampleCollapse",
  //   views: [
  //     {
  //       path: "/ag-grid-sample",
  //       name: "AgGrid Sample",
  //       rtlName: "",
  //       // icon: "content_paste",
  //       mini: "AS",
  //       component: AgGrid,
  //       layout: "/admin",
  //     },
  //     {
  //       path: "/radar-sample",
  //       name: "Radar Sample",
  //       rtlName: "RS",
  //       mini: "RS",
  //       // icon: Dashboard,
  //       component: RadarSample,
  //       layout: "/admin",
  //     },
  //   ]
  // },
  
  {
    path: "/companies",
    name: "Companies",
    rtlName: "",
    icon: Business,
    component: Companies,
    layout: "/admin",
  },
  {
    path: "/company-member",
    name: "Users",
    rtlName: "",
    icon: Group,
    component: CompanyAdmin,
    layout: "/admin",
  },
  {
    path: "/new-entries",
    name: "New Entries",
    rtlName: "",
    icon: AddCircleIcon,
    component: EntriesPage,
    layout: "/admin",
  },
  {
    path: "/all-entries",
    name: "View Entries",
    rtlName: "",
    icon: PageviewIcon,
    component: EntriesView,
    layout: "/admin",
  },
  {
    path: "/radar-entries",
    name: "Radar Chart",
    rtlName: "",
    icon: DirectionsIcon,
    component: RadarEntries,
    layout: "/admin",
  },
  {
    path: "/scoreboard",
    name: "ScoreBoard",
    rtlName: "",
    icon: BubbleChartIcon,
    component: ScoreBoardPage,
    layout: "/admin",
  },
];

export default dashboardRoutes;
