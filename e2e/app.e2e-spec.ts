import { EoiReportPage } from './app.po';

describe('eoi-report App', function() {
  let page: EoiReportPage;

  beforeEach(() => {
    page = new EoiReportPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
