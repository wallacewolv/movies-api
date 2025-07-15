import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fieldPipe',
  standalone: true,
})
export class FieldPipe implements PipeTransform {
  transform(value: string): string {
    const fields: { [key: string]: string } = {
      anoLancamento: 'Ano lançamento',
      genero: 'Gênero',
      nome: 'Nome',
      asc: 'Ascendente',
      desc: 'Descendente',
    };

    return fields[value];
  }
}
