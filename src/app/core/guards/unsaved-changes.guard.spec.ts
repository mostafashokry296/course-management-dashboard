import { unsavedChangesGuard } from './unsaved-changes.guard';
import { CanComponentDeactivate } from './can-component-deactivate';

describe('unsavedChangesGuard', () => {
  it('should allow navigation when component has no canDeactivate method', () => {
    const result = unsavedChangesGuard({} as CanComponentDeactivate, {} as never, {} as never, {} as never);
    expect(result).toBe(true);
  });

  it('should defer to the component canDeactivate result', () => {
    const component: CanComponentDeactivate = {
      canDeactivate: () => false,
    };

    const result = unsavedChangesGuard(component, {} as never, {} as never, {} as never);
    expect(result).toBe(false);
  });
});
