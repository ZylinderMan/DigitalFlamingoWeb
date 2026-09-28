import type { SectionDefinition } from "./types";
import { heroSection } from "./hero";
import { servicesSection } from "./services";
import { demoSection } from "./demo";

/**
 * PAGE ORDER
 * Sections appear on the page (and in the header/footer nav) in this order.
 * To add a section: create a file in this folder, import it, add it to the list.
 */
export const sections: SectionDefinition[] = [heroSection, servicesSection, demoSection];
