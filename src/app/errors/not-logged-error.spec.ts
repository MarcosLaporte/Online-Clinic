import { NotLoggedError } from './not-logged-error';

describe('NotLoggedError', () => {
  it('should create an instance', () => {
    expect(new NotLoggedError()).toBeTruthy();
  });
});
