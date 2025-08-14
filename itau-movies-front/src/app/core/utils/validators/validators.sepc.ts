import { getPortuguesePaginatorIntl } from './get-portuguese-paginator-intl';

describe('Validators', () => {
  const paginatorIntl = getPortuguesePaginatorIntl();

  it('should have the correct labels in Portuguese', () => {
    expect(paginatorIntl.itemsPerPageLabel).toBe('Item(s) por página');
    expect(paginatorIntl.nextPageLabel).toBe('Próxima página');
    expect(paginatorIntl.previousPageLabel).toBe('Página anterior');
    expect(paginatorIntl.firstPageLabel).toBe('Primeira página');
    expect(paginatorIntl.lastPageLabel).toBe('Última página');
  });
});
