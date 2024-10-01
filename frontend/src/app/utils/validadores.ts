import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ValidarEmail(control: AbstractControl) {
  const email = control?.value as string;
  const EMAIL_REGEXP = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  if (email != null && email.length > 0 && !EMAIL_REGEXP.test(email)) {
    return { ValidarEmail: 'Email no válido.' };
  } else {
    return null;
  }
}

export function ValidarCadenaSinEspacios(control: AbstractControl) {
  if (control.value && control.value.trim() === '') {
    return { ValidarCadenaSinEspacios: true };
  } else {
    return null;
  }
}

// Validador personalizado para verificar que dos campos sean iguales
export const ContraseniasIguales: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value !== confirmPassword.value ? { contraseñasNoCoinciden: true } : null;
};
export function ValidarDni(control: AbstractControl) {
  const dni = control?.value;
  if (String(dni).length != 8) {
    return { ValidarDni: 'El dni tiene que ser de 8 numeros.' };
  } else {
    return null;
  }
}
