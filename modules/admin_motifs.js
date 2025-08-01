import { fetchOpenProjects } from './api.js';
import { populateDropdown } from './ui.js';

export async function populateProjectDropdown(selectEl, selectedId = null) {
    await populateDropdown(fetchOpenProjects, selectEl, selectedId, 'name');
}
