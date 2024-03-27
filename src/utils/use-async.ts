import type { Ref } from 'vue';
import { ref } from 'vue';
import { routerPush } from 'src/router';
import { isFetchError } from 'src/services';
import { userStorage } from 'src/store/user.ts';
/*
Этот интерфейс имеет один обобщенный тип T,
который должен быть функцией, принимающей любое
количество аргументов (задекларированных как unknown) и возвращающей что угодно (unknown).
*/
// Parameters
/*function greet(name: string, age: number): void {
    console.log(`Hello, ${name}! You are ${age} years old.`);
}

type GreetParams = Parameters<typeof greet>; // GreetParams будет иметь тип [string, number]
*/

// ReturnType
/*function greet(): string {
    return "Hello, world!";
}

type GreetReturn = ReturnType<typeof greet>; // GreetReturn будет иметь тип string
*/

interface UseAsync<T extends (...args: unknown[]) => unknown> {
  active: Ref<boolean>;
  run: (...args: Parameters<T>) => Promise<ReturnType<T>>;
}

export default function useAsync<T extends (...args: unknown[]) => unknown>(fn: T): UseAsync<T> {
  const active: UseAsync<T>['active'] = ref(false);
  const run: UseAsync<T>['run'] = async (...args) => {
    active.value = true;
    try {
      const result = await fn(...args);
      return result as ReturnType<T>;
    } catch (error) {
      if (isFetchError(error) && error.status === 401) {
        userStorage.remove();
        await routerPush('login');
        throw new Error('Unauthorized or token expired');
      }
      throw error;
    } finally {
      active.value = false;
    }
  };

  return { active, run };
}
