(()=>{
  // Sidebar container creation
const sidebarContainer = document.createElement("div");
sidebarContainer.id = "sidebar";
document.body.appendChild(sidebarContainer);

// Function to apply dynamic CSS
function applyDynamicCSS() {
const style = document.createElement("style");
style.textContent = `
  #sidebar {
    width: 250px;
    background-color: #f8f9fa;
    border-right: 1px solid #dee2e6;
    padding: 10px;
  }
  .sidebar-item {
    margin: 10px 0;
  }
  .sidebar-link {
    font-weight: bold;
    text-decoration: none;
    display: block;
    padding: 5px 10px;
    color: #333;
    border-radius: 4px;
  }
  .sidebar-link:hover {
    background-color: #e9ecef;
  }
  .sidebar-child-container {
    margin-left: 20px;
  }
  .sidebar-child-link {
    text-decoration: none;
    display: block;
    padding: 5px 10px;
    color: #555;
    border-radius: 4px;
  }
  .sidebar-child-link:hover {
    background-color: #e9ecef;
  }
  .sidebar-child-link img {
    margin-right: 5px;
    vertical-align: middle;
  }
`;
document.head.appendChild(style);
}

// Function to create sidebar menu dynamically
function generateSidebarMenu(items) {
items.forEach((item) => {
  // Create parent menu item
  const parentItem = document.createElement("div");
  parentItem.classList.add("sidebar-item");
  parentItem.innerHTML = `
    <a href="#" id="${item.id.replace("a#", "")}" class="sidebar-link">${item.title}</a>
  `;

  // Create child menu container
  if (item.childs && item.childs.length > 0) {
    const childContainer = document.createElement("div");
    childContainer.classList.add("sidebar-child-container");

    item.childs.forEach((child) => {
      const childLink = document.createElement("a");
      childLink.classList.add("sidebar-child-link");
      childLink.href = child.url || "#";
      childLink.id = child.id.replace("a#", "");
      childLink.textContent = child.title;

      if (child.img) {
        const childImg = document.createElement("img");
        childImg.src = child.img;
        childImg.alt = `${child.title} icon`;
        childLink.prepend(childImg);
      }

      childContainer.appendChild(childLink);
    });

    parentItem.appendChild(childContainer);
  }

  sidebarContainer.appendChild(parentItem);
});
}


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

applyDynamicCSS();
generateSidebarMenu(items);

})()