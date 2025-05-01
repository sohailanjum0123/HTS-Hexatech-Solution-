(() => {
  function mainScript() {
    const sidebarLoc = document.querySelector("#sidebar-v2 .hl_nav-header nav");

    if (!sidebarLoc) {
      console.error("Element not found for selector: #sidebar-v2 .hl_nav-header nav");
      return;
    }

    const items = [
      {
        title: "Lunchpad",
        id: "a#sb_launchpad",
        parent: true,
        childs: [
          { title: "Market Place", id: "a#sb_app-marketplace", img: "", url: "integration" },
          { title: "Mobile App", id: "a#sb_location-mobile-app", img: "", url: "mobile_app" },
          { title: "Docusign", id: "1670b203-aa0b-46d8-b4d6-d06f82390103", img: "", url: "custom-menu-link/1670b203-aa0b-46d8-b4d6-d06f82390103" },
        ],
      },
      {
        title: "My Business",
        id: "a#sb_dashboard",
        parent: true,
        childs: [
          { title: "Business PipeLine", id: "a#sb_opportunities", img: "", url: "list" },
          { title: "Property Search", id: "5f4e2642-7871-4206-96a6-a13e25a49c86", img: "", url: "propertySearch" },
          { title: "Contacts", id: "a#sb_contacts", img: "", url: "smart_list/All" },
          { title: "Message Center", id: "a#sb_conversations", img: "", url: "conversations" },
        ],
      },
      {
        title: "Calendars",
        id: "a#sb_calendars",
        parent: true,
        childs: [{ title: "Calendar Blocking", id: "f3fd01b6-24e0-44e7-8478-696672f9dfe7", img: "", url: "custom-menu-link/f3fd01b6-24e0-44e7-8478-696672f9dfe7" }],
      },
      {
        title: "Database Marketing",
        id: "a#sb_email-marketing",
        parent: true,
        childs: [
          { title: "Automation", id: "a#sb_automation", img: "", url: "automation/workflows" },
          { title: "Website & Forms", id: "a#sb_sites", img: "", url: "funnels-websites/funnels" },
          { title: "Review Management", id: "a#sb_reputation", img: "", url: "reputation/overview" },
          { title: "Thanks.io", id: "24a2f8c7-7a36-442e-9d29-d0fe7533b941", img: "", url: "custom-menu-link/24a2f8c7-7a36-442e-9d29-d0fe7533b941" },
          { title: "Online Ad Metrics", id: "a#sb_reporting", img: "", url: "reporting/reports" },
          { title: "Media Storage", id: "a#sb_app-media", img: "", url: "media-storage" },
          { title: "Training Center", id: "a#sb_memberships", img: "", url: "client-portal/dashboard" },
        ],
      },
      {
        title: "Settings",
        id: "a#sb_settings",
        parent: true,
        childs: [
         {
          parent: true,
          title: "My Business",
          id:"#",
          img,
          childs:[
            { title: "Billing", id: "a#sb_saas-billing", img: "", url: "settings/company-billing/billing" },
            { title: "My Staff", id: "a#sb_my-staff", img: "", url: "settings/staff/team" },
            { title: "Opportunities & Pipelines", id: "a#sb_Opportunities-Pipelines", img: "", url: "crm-settings" },
          ]
         },
         {
          parent: true,
          title: "Business Services",
          id:"#",
          img,
          childs:[
            { title: "Automation", id: "a#sb_", img: "", url: "settings/automation" },
            { title: "Calendars", id: "a#sb_calendars", img: "", url: "settings/calendars/" },
            { title: "Conversion AI", id: "a#sb_conversation_ai_settings_v2", img: "", url: "settings/conversation-ai-v2/" },
            { title: "Voice AI Agents", id: "a#sb_ai_agent_settings", img: "", url: "settings/ai-agents/" },
            { title: "Email Services", id: "a#sb_location-email-services", img: "", url: "settings/smtp_service" },
            { title: "Phone Numbers", id: "a#sb_phone-number", img: "", url: "settings/phone_number" },
            { title: "Whats App", id: "a#sb_whatsapp", img: "", url: "settings/whatsapp" },
          ]
         },
         {
          parent: true,
          title: "Other Settings",
          id:"#",
          img,
          childs:[
            { title: "Objects ", id: "a#sb_objects", img: "", url: "settings/objects/" },
            { title: "Custom Fields", id: "a#sb_custom-fields-settings", img: "", url: "settings/fields" },
            { title: "Custom Values", id: "a#sb_custom-values", img: "", url: "settings/custom_values" },
            { title: "Manage Scoring", id: "a#sb_manage-scoring", img: "", url: "settings/scoring" },
            { title: "Domains", id: "a#sb_domains", img: "", url: "settings/domain" },
            { title: "URL Redirects", id: "a#sb_url-redirects", img: "", url: "settings/redirect" },
            { title: "Integrations", id: "a#sb_integrations", img: "", url: "settings/integrations/list" },
            { title: "Private Integrations", id: "a#sb_undefined", img: "", url: "settings/private-integrations/" },
            { title: "Conversation Providers", id: "a#sb_conversations_providers", img: "", url: "settings/conversation_providers" },
            { title: "Tags", id: "a#sb_tags", img: "", url: "settings/tags" },
            { title: "Labs", id: "a#sb_labs", img: "", url: "settings/labs" },
            { title: "Audit Logs", id: "a#sb_audit-logs-location", img: "", url: "settings/audit/logs" },
            { title: "Brand Boards", id: "a#sb_brand-boards", img: "", url: "marketing/brand-boards" },
            { title: "Companies", id: "a#sb_business-settings-v2", img: "", url: "settings/objects/6789681baae233321f75964f/details" },
          ]
         },
        ],
      },
    ];

    // Add CSS for transitions and effects
    const style = document.createElement("style");
    style.textContent = `
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
      }
      .sidebar-navigation {
        width: 256px;
        background-color: #fff;
        border-right: 1px solid #ccc;
        box-shadow: 3px 5px 10px rgba(0, 0, 0, 0.16);
        height: 100vh;
        overflow-y: auto;
      }
      .sidebar-navigation ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .sidebar-navigation li {
        position: relative;
      }
      .sidebar-navigation a {
        display: block;
        padding: 10px 20px;
        text-decoration: none;
        color: #141414;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s, color 0.3s;
      }
      .sidebar-navigation a:hover {
        background-color:#FF9500;
        color: #141414;
      }
      .sidebar-navigation a.active {
        background-color: #FF9500;
        color: #141414;
      }
      .sidebar-navigation ul ul {
        display: none;
        opacity: 0;
        transform: translateY(-20px);
        transition: opacity 0.3s, transform 0.3s ease-in-out;
        padding-left: 20px;
      }
      .sidebar-navigation li:hover > ul {
        display: block;
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.3s, transform 0.5s ease-in-out;
      }
    `;
    document.head.appendChild(style);

    const createMenu = (menu) => {
      const ul = document.createElement("ul");

      menu.forEach((item) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.textContent = item.title;
        a.href = item.url || "#";
        a.id = item.id;

        li.appendChild(a);

        if (item.childs) {
          const subMenu = createMenu(item.childs);
          li.appendChild(subMenu);
        }

        ul.appendChild(li);
      });

      return ul;
    };

    const sidebar = document.createElement("div");
    sidebar.classList.add("sidebar-navigation");
    sidebar.appendChild(createMenu(items));

    sidebarLoc.append(sidebar);
  }

  mainScript();
})();
