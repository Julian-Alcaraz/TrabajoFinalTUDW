import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PrimeNGConfig } from 'primeng/api';
import { Aura } from 'primeng/themes/aura';
import { definePreset, palette } from 'primeng/themes';
// import { Lara } from 'primeng/themes/lara';
// import { Nora } from 'primeng/themes/nora';

// const MyPreset = definePreset(Aura, {
//   semantic: {
//     primary: {
//       blue: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554' },
//     },
//   },
// });

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Fundación Sol';

  // validar si existe la session
  constructor(private primengConfig: PrimeNGConfig) {
    this.primengConfig.setTranslation({
      accept: 'Sí',
      addRule: 'Agregar regla',
      am: 'AM',
      apply: 'Aplicar',
      cancel: 'Cancelar',
      choose: 'Escoger',
      chooseDate: 'Elige fecha',
      chooseMonth: 'Elige el mes',
      chooseYear: 'Elige Año',
      clear: 'Limpiar',
      contains: 'Contenga',
      dateAfter: 'Fecha después de',
      dateBefore: 'Fecha antes de',
      dateFormat: 'dd/mm/yy',
      dateIs: 'Fecha igual a',
      dateIsNot: 'Fecha diferente a',
      dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      emptyFilterMessage: 'Sin opciones disponibles',
      emptyMessage: 'No se han encontrado resultados',
      emptySearchMessage: 'Sin opciones disponibles',
      emptySelectionMessage: 'Ningún artículo seleccionado',
      endsWith: 'Termine con',
      equals: 'Igual a',
      fileSizeTypes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      firstDayOfWeek: 1,
      gt: 'Mayor que',
      gte: 'Mayor o igual a',
      lt: 'Menor que',
      lte: 'Menor o igual a',
      matchAll: 'Coincidir todo',
      matchAny: 'Coincidir con cualquiera',
      medium: 'Medio',
      monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      nextDecade: 'Próxima década',
      nextHour: 'próxima hora',
      nextMinute: 'Siguiente minuto',
      nextMonth: 'Próximo mes',
      nextSecond: 'Siguiente segundo',
      nextYear: 'El próximo año',
      noFilter: 'Sin filtro',
      notContains: 'No contenga',
      notEquals: 'Diferente a',
      passwordPrompt: 'Escriba una contraseña',
      pending: 'Pendiente',
      pm: 'PM',
      prevDecade: 'Década anterior',
      prevHour: 'Hora anterior',
      prevMinute: 'Minuto anterior',
      prevMonth: 'Mes anterior',
      prevSecond: 'Anterior Segundo',
      prevYear: 'Año anterior',
      reject: 'No',
      removeRule: 'Eliminar regla',
      searchMessage: '{0} resultados están disponibles',
      selectionMessage: '{0} elementos seleccionados',
      startsWith: 'Comience con',
      strong: 'Fuerte',
      today: 'Hoy',
      upload: 'Subir',
      weak: 'Débil',
      weekHeader: 'Sem',
      aria: {
        cancelEdit: 'Cancelar editado',
        close: 'Cerrar',
        collapseRow: 'Reducir Fila',
        editRow: 'Editar fila',
        expandRow: 'Expandir Fila',
        falseLabel: 'Falso',
        filterConstraint: 'Restricción de filtro',
        filterOperator: 'Operador de filtro',
        firstPageLabel: 'Primera Página',
        gridView: 'Vista de cuadrícula',
        hideFilterMenu: 'Ocultar menú del filtro',
        jumpToPageDropdownLabel: 'Ir al menú desplegable de página',
        jumpToPageInputLabel: 'Ir a la entrada de página',
        lastPageLabel: 'Última Página',
        listView: 'Vista de lista',
        moveAllToSource: 'Mover todo al origen',
        moveAllToTarget: 'Mover todo al objetivo',
        moveBottom: 'Desplazarse hacia abajo',
        moveDown: 'Bajar',
        moveTop: 'Mover arriba',
        moveToSource: 'Mover al origen',
        moveToTarget: 'Mover al objetivo',
        moveUp: 'Subir',
        navigation: 'Navegación',
        next: 'Siguiente',
        nextPageLabel: 'Siguiente Página',
        nullLabel: 'No seleccionado',
        pageLabel: 'Página {page}',
        previous: 'Anterior',
        previousPageLabel: 'Página Anterior',
        removeLabel: 'Eliminar',
        rotateLeft: 'Girar a la izquierda',
        rotateRight: 'Girar a la derecha',
        rowsPerPageLabel: 'Filas por página',
        saveEdit: 'Guardar editado',
        scrollTop: 'Desplazarse hacia arriba',
        selectAll: 'Seleccionar todos',
        selectRow: 'Seleccionar fila',
        showFilterMenu: 'Mostrar menú del filtro',
        slide: 'Deslizar',
        slideNumber: '{slideNumber}',
        star: '1 estrella',
        stars: '{star} estrellas',
        trueLabel: 'Verdadero',
        unselectAll: 'Deseleccionar todos',
        unselectRow: 'Desmarcar fila',
        zoomImage: 'Ampliar imagen',
        zoomIn: 'Ampliar',
        zoomOut: 'Reducir',
      },
    });
    this.primengConfig.theme.set({
      //preset: Aura,
      preset: definePreset(Aura, {
        semantic: { primary: palette('{blue}') },
      }),
      options: {
        prefix: 'p',
        darkModeSelector: '.my-app-dark',
        cssLayer: false,
      },
    });
  }
  ngOnInit() {
    this.primengConfig.ripple.set(true);
  }
}
