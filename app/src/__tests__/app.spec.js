import { menuOpen } from '../js/functions.js';


describe('Page Test', () => {
    it('Should render the app', () => {
        const pageRender = document.getElementsByClassName('bodyContent');
        expect(pageRender).toBeTruthy();
    })
})