import "./styles/theme.css";
import "./styles/base.css";
import "./styles/header.css";
import "./styles/sections.css";
import "./styles/footer.css";
import "./styles/demo.css";
import "./styles/mockup.css";
import "./styles/templates/building.css";
import "./styles/templates/restaurant.css";
import "./styles/templates/health.css";

import { applyTranslations } from "./i18n";
import { sections } from "./sections";
import { createSection } from "./sections/createSection";
import { createHeader } from "./components/header";
import { createFooter } from "./components/footer";
import { el } from "./utils/dom";
import { initDemoDeepLinks } from "./demo/demoDialog";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error('Missing <div id="app"> in index.html');

const main = el("main", { children: sections.map(createSection) });

app.append(createHeader(sections), main, createFooter(sections));

// Sets <title>, <html lang> and any remaining text for the detected language
applyTranslations();

// Opens the demo directly for links like /#demo-restaurant
initDemoDeepLinks();
