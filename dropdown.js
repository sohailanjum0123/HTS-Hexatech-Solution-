const launchedPad = document.querySelector("a#sb_launchpad");

const marketPlace = document.querySelector("a#sb_app-marketplace");
const mobileApp = document.querySelector("a#sb_location-mobile-app");
const anchor = document.getElementById("1670b203-aa0b-46d8-b4d6-d06f82390103");

const myBusiness = document.querySelector("a#sb_dashboard");

const businessPipeline = document.querySelector("a#sb_opportunities");
const PropertySearch = document.getElementById(
  "5f4e2642-7871-4206-96a6-a13e25a49c86"
);
const contacts = document.querySelector("a#sb_contacts");
const messageCenter = document.querySelector("a#sb_conversations");

const calendars = document.querySelector("a#sb_calendars");
Parent;
const calendarBlocking = document.getElementById(
  "f3fd01b6-24e0-44e7-8478-696672f9dfe7"
);

let items = [
  {
    title: "Lunchpad",
    id: "a#sb_launchpad",
    parent: true,
    childs: [
      {
        title: "market Place",
        id: "a#sb_app-marketplace",
        img: "",
        url: "integration",
      },
      {
        title: "mobile App",
        id: "a#sb_location-mobile-app",
        img: "",
        url: "mobile_app",
      },
      {
        title: "Docusign",
        id: "1670b203-aa0b-46d8-b4d6-d06f82390103",
        img: "",
        url: "custom-menu-link/1670b203-aa0b-46d8-b4d6-d06f82390103",
      },
    ],
  },
  {
    title: "My Business",
    id: "a#sb_dashboard",
    parent: true,
    childs: [
      {
        title: "Business PipeLine",
        id: "a#sb_opportunities",
        img: "",
        url: "opportunities/list",
      },
      {
        title: "Property Search",
        id: "5f4e2642-7871-4206-96a6-a13e25a49c86",
        img: "",
        url: "propertySearch",
      },
      {
        title: "Contacts",
        id: "a#sb_contacts",
        img: "",
        url: "contacts/smart_list/All",
      },
      {
        title: "Message Center",
        id: "a#sb_conversations",
        img: "",
        url: "conversations/conversations",
      },
    ],
  },
  {
    title: "Calendars ",
    id: "a#sb_calendars",
    parent: true,
    childs: [
      {
        title: "calendar Blocking",
        id: "f3fd01b6-24e0-44e7-8478-696672f9dfe7",
        img: "",
        url: "custom-menu-link/f3fd01b6-24e0-44e7-8478-696672f9dfe7",
      },
    ],
  },
  {
    title: "Database Marketing",
    id: "a#sb_email-marketing",
    parent: true,
    childs: [
      {
        title: "Automation",
        id: "a#sb_automation",
        img: "",
        url: "automation/workflows",
      },
      {
        title: "Website & Forms",
        id: "a#sb_sites",
        img: "",
        url: "funnels-websites/funnels",
      },
      {
        title: "Review Management",
        id: "a#sb_reputation",
        img: "",
        url: "reputation/overview",
      },
      {
        title: "Thanks.io",
        id: "24a2f8c7-7a36-442e-9d29-d0fe7533b941",
        img: "",
        url: "custom-menu-link/24a2f8c7-7a36-442e-9d29-d0fe7533b941",
      },
      {
        title: "Online Ad Metrics",
        id: "a#sb_reporting",
        img: "",
        url: "reporting/reports",
      },
      {
        title: "Media Storage",
        id: "a#sb_app-media",
        img: "",
        url: "media-storage",
      },
      {
        title: "Training Center",
        id: "a#sb_memberships",
        img: "",
        url: "memberships/client-portal/dashboard",
      },
    ],
  },
];
