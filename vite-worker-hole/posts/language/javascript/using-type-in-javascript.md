# 자바스크립트에서 타입 사용하기

자바스크립트로 프로젝트를 진행하다 보면, 라이브러리를 사용할 때 어떤 값을 인자로 전달해야 하고, 반환되는 값이 어떤 형태일지 명확하지 않은 경우가 자주 발생합니다. 이런 상황에서는 문서를 일일이 찾아보지 않으면 정확한 사용 방법을 알기 어려워 개발이 복잡해질 수 있습니다.

이러한 문제를 해결하기 위해 **JSDoc**이 탄생했습니다. JSDoc은 자바스크립트 코드에 주석을 달아 함수, 변수, 객체 등의 타입과 역할을 명확히 설명할 수 있도록 도와주는 도구입니다. 이를 통해 코드의 가독성을 높이고, 협업할 때 다른 개발자가 코드를 쉽게 이해할 수 있도록 지원합니다. JSDoc은 특히 코드 자동 완성, 타입 검사 등의 기능을 제공하여, 자바스크립트에서도 타입 안정성을 확보할 수 있게 해줍니다.

하지만 자바스크립트의 타입 관리에 대한 요구가 점점 더 커지면서, **타입스크립트**가 등장하게 되었습니다. 타입스크립트는 자바스크립트의 상위 집합으로, 정적 타입 검사를 지원하여 코드 작성 시점에 타입 오류를 발견할 수 있게 해줍니다. 이로 인해 더욱 강력한 타입 안전성을 제공하며, 코드의 유지보수성을 크게 향상시켰습니다.

그럼에도 불구하고, 많은 개발자들은 여전히 순수 자바스크립트를 사용하고자 하는 경우가 많습니다. 그 이유는 타입스크립트로 작성된 코드는 결국 자바스크립트로 컴파일되어 실행되기 때문입니다. 따라서, 코드 작성 과정에서 타입 안정성을 확보하고자 한다면, JSDoc을 활용하여 자바스크립트에서 직접 타입을 관리하는 것도 좋은 방법이 될 수 있습니다. JSDoc을 사용하면 기존 자바스크립트 코드베이스를 크게 변경하지 않고도 타입 안정성을 높일 수 있기 때문에, 보다 간편하게 자바스크립트를 활용할 수 있습니다.

## JSDoc 사용하기

### 사용하기 전에

사실 JSDoc은 문서화를 위한 도구 입니다. 타입검사를 위한 도두가 아닙니다.
타입 검사는 현대 IDE 가 JSDoc을 이용해 타입을 추론하고 검사하는 방식으로 이루어집니다.

그래서 자바스크립트에서 타입을 명시하고 사용하기 위해서는 JSDoc 문법을 지원하는 IDE를 사용해야합니다.

기본적으로 지원하는 IDE는 다음과 같습니다.

- Visual Studio Code
- WebStorm
- IntelliJ IDEA

### 명시 가능한 타입

### 사용하기 전에

사실 JSDoc은 문서화를 위한 도구입니다. 타입 검사를 위한 도구는 아닙니다. JSDoc은 코드에 주석을 달아 함수, 변수, 객체 등의 사용법과 타입 정보를 명시하는 데 도움을 줍니다. 하지만 실제 타입 검사는 JSDoc이 아닌, 현대적인 IDE가 JSDoc 주석을 이용해 타입을 추론하고 검사하는 방식으로 이루어집니다.

따라서 자바스크립트에서 타입을 명시하고 사용하는 데 있어서는, JSDoc 문법을 지원하는 IDE를 사용하는 것이 중요합니다. 이들 IDE는 JSDoc 주석을 해석하여 코드 작성 중에 자동 완성, 타입 오류 감지 등의 기능을 제공해 개발 효율성을 크게 높여줍니다.

기본적으로 지원하는 IDE는 다음과 같습니다:

- Visual Studio Code
- WebStorm
- IntelliJ IDEA

### 명시 가능한 타입

JSDoc을 사용하면 다양한 타입을 명시할 수 있습니다. 이 섹션에서는 JSDoc에서 명시할 수 있는 주요 타입들을 소개합니다.

#### 기본 원시 타입 (Primitive Types)

기본 원시 타입은 자바스크립트의 가장 기본적인 데이터 유형을 나타내며, JSDoc에서는 아래와 같은 타입들을 명시할 수 있습니다:

- **`number`**: 숫자 타입. 정수와 부동소수점 숫자 모두를 포함합니다.

  ```javascript
  /**
   * @type {number}
   */
  let count = 42;
  ```

- **`string`**: 문자열 타입. 텍스트 데이터를 표현합니다.

  ```javascript
  /**
   * @type {string}
   */
  let name = 'Alice';
  ```

- **`boolean`**: 불리언 타입. 참(`true`) 또는 거짓(`false`) 값을 가집니다.

  ```javascript
  /**
   * @type {boolean}
   */
  let isActive = true;
  ```

- **`null`**: `null` 값. 명시적으로 "값이 없음"을 나타냅니다.

  ```javascript
  /**
   * @type {null}
   */
  let emptyValue = null;
  ```

- **`undefined`**: `undefined` 값. 변수는 선언되었지만 값이 할당되지 않은 상태를 나타냅니다.

  ```javascript
  /**
   * @type {undefined}
   */
  let notDefined;
  ```

- **`symbol`**: 고유하고 변경 불가능한 원시값을 생성하는 데 사용되는 심볼 타입.

  ```javascript
  /**
   * @type {symbol}
   */
  let uniqueKey = Symbol('key');
  ```

- **`bigint`**: 아주 큰 정수를 표현할 수 있는 타입. 보통 2^53 이상의 정수를 다룰 때 사용합니다.
  ```javascript
  /**
   * @type {bigint}
   */
  let largeNumber = 9007199254740991n;
  ```

#### 복합 타입 (Complex Types)

기본 원시 타입 외에도 JSDoc은 여러 타입을 조합한 복합 타입을 명시할 수 있습니다:

- **객체 타입 (`Object`)**: 객체의 구조를 명시합니다.

  ```javascript
  /**
   * @typedef {Object} User
   * @property {number} id - The user's ID
   * @property {string} name - The user's name
   * @property {boolean} isActive - The user's active status
   */

  /**
   * @type {User}
   */
  const user = {
  	id: 1,
  	name: 'Alice',
  	isActive: true
  };
  ```

- **배열 타입 (`Array`)**: 배열의 각 요소가 어떤 타입인지 명시합니다.

  ```javascript
  /**
   * @type {number[]}
   */
  let scores = [95, 85, 76];

  /**
   * @type {Array<string>}
   */
  let fruits = ['apple', 'banana', 'cherry'];
  ```

- **유니온 타입 (`Union Types`)**: 변수나 매개변수가 여러 타입 중 하나일 수 있음을 나타냅니다.

  ```javascript
  /**
   * @type {string | number}
   */
  let id;
  ```

- **인터섹션 타입 (`Intersection Types`)**: 여러 타입을 조합하여 하나의 타입으로 만듭니다.

  ```javascript
  /**
   * @typedef {Object} Person
   * @property {string} name
   * @property {number} age
   */

  /**
   * @typedef {Object} Employee
   * @property {number} employeeId
   */

  /**
   * @type {Person & Employee}
   */
  const employee = {
  	name: 'Alice',
  	age: 30,
  	employeeId: 12345
  };
  ```

#### 함수 타입 (Function Types)

함수의 매개변수와 반환값의 타입을 명시할 수 있습니다:

- **함수의 타입 명시**: 함수의 매개변수와 반환값의 타입을 명시합니다.

  ```javascript
  /**
   * @param {number} x - The first number
   * @param {number} y - The second number
   * @returns {number} The sum of x and y
   */
  function add(x, y) {
  	return x + y;
  }
  ```

- **함수의 타입 정의**: 화살표 함수 등에도 타입을 명시할 수 있습니다.
  ```javascript
  /**
   * @type {(a: string, b: string) => string}
   */
  const concatenate = (a, b) => `${a}${b}`;
  ```

#### 제너릭 타입 (Generic Types)

제너릭 타입을 사용하면 여러 타입에 대해 동일한 로직을 적용할 수 있습니다:

- **제너릭 함수**: 타입 매개변수를 사용하여 다양한 타입을 처리하는 함수를 정의합니다.
  ```javascript
  /**
   * @template T
   * @param {T} value - The value to wrap
   * @returns {{ value: T }} The wrapped value
   */
  function wrapValue(value) {
  	return { value };
  }
  ```

#### 리터럴 타입 (Literal Types)

특정 값만 허용하는 리터럴 타입을 명시할 수 있습니다:

- **리터럴 타입**: 변수나 매개변수가 특정 값만 가질 수 있게 제한합니다.
  ```javascript
  /**
   * @type {"success" | "error" | "pending"}
   */
  let status = 'success';
  ```

이 외에도 JSDoc은 `Promise`, `Record`, `Tuple`, `Any` 등 다양한 타입 명시를 지원합니다. 이들을 활용하여 자바스크립트 코드에서 보다 명확한 타입 안전성을 확보할 수 있습니다.

#### 타입 정의 가져오기 (Type Importing)

JSDoc에서는 외부 모듈에서 정의된 타입을 가져와 사용할 수 있습니다. 이를 통해 다른 파일이나 라이브러리에서 제공하는 타입을 재사용할 수 있습니다.

특히, 타입스크립트로 작성된 라이브러리의 경우에도 선언된 타입이나 인터페이스를 JSDoc을 통해 가져와 사용할 수 있습니다.

- **타입 가져오기 및 따로 정의**: `import`를 사용하여 외부 모듈의 타입을 가져와 따로 정의할 수 있습니다.

  ```javascript
  /** @typedef {import('some-module').SomeType} SomeType */

  /**
   * @type {SomeType}
   */
  let someVariable;
  ```

- **타입 가져오기 및 즉시 사용**: 타입을 직접 선언하여 사용할 수 있습니다.

  ```javascript
  /**
   * @type {import('some-module').SomeType}
   */
  let someVariable;
  ```

  위 예시에서는 `some-module`이라는 외부 모듈에서 `SomeType` 타입을 가져와 사용하고 있습니다. 이를 통해 타입을 재사용하고, 코드의 일관성을 유지할 수 있습니다.

#### Nullable 타입 (Nullable Types)

Nullable 타입은 변수나 매개변수가 `null` 또는 `undefined` 값을 가질 수 있음을 나타냅니다. JSDoc에서는 `?` 또는 `| null`, `| undefined`를 사용하여 Nullable 타입을 명시할 수 있습니다.

- **Nullable 타입**: 특정 값이 `null` 또는 `undefined`가 될 수 있음을 나타냅니다.

  ```javascript
  /**
   * @type {?string}
   */
  let nickname = null;

  /**
   * @type {number | undefined}
   */
  let age;
  ```

  이 예시에서 `nickname`은 `null`일 수 있으며, `age`는 `undefined`일 수 있음을 명시합니다. 이를 통해 코드에서 의도한 대로 변수가 비어있을 수 있음을 명확히 나타낼 수 있습니다.

#### 비동기 함수 타입 (Promise Types)

자바스크립트의 비동기 함수는 주로 `Promise` 객체를 반환합니다. JSDoc에서는 비동기 함수의 반환 타입을 `Promise<Type>` 형식으로 명시할 수 있습니다.

- **Promise 타입**: 비동기 함수가 반환하는 `Promise`의 타입을 명시합니다.

  ```javascript
  /**
   * 데이터를 비동기로 가져옵니다.
   * @returns {Promise<string>} 비동기 함수의 결과로 문자열을 반환하는 Promise
   */
  async function fetchData() {
  	return 'data';
  }
  ```

  여기서 `fetchData` 함수는 문자열을 반환하는 `Promise`를 반환하는 비동기 함수임을 명확히 합니다. 이를 통해 비동기 함수의 동작을 더 잘 이해할 수 있습니다.

#### Any 타입

JSDoc에서는 `any` 타입을 사용할 수 있습니다. `any` 타입은 모든 타입을 허용하지만, 가능한 사용을 피하는 것이 좋습니다.

- **Any 타입**: 특정 타입을 지정하지 않고, 모든 타입을 허용할 때 사용합니다. 그러나 이는 타입 안정성을 떨어뜨릴 수 있으므로 신중하게 사용해야 합니다.

  ```javascript
  /**
   * @type {any}
   */
  let anything;

  anything = 42; // number 타입으로 사용 가능
  anything = 'Hello'; // string 타입으로 사용 가능
  ```

  `any` 타입은 유연하지만, 잘못된 타입 사용으로 인한 오류를 방지하기 어렵다는 단점이 있습니다.

#### 14. **레코드와 맵핑 타입 (Record Types)**

레코드와 맵핑 타입을 사용하면 객체의 키와 값의 타입을 명시할 수 있습니다. 이는 특히 객체의 속성이 동적으로 생성될 때 유용합니다.

- **Record 타입**: 키와 값의 타입을 명시합니다.

  ```javascript
  /**
   * @type {Record<string, number>}
   */
  const nameToAgeMap = {
  	Alice: 30,
  	Bob: 25
  };
  ```

  위 예시에서는 `nameToAgeMap` 객체가 문자열 키(`string`)와 숫자 값(`number`)을 가지는 레코드임을 명시합니다. 이는 객체의 구조를 명확히 하고, 잘못된 키-값 쌍의 사용을 방지하는 데 도움을 줍니다.

이 외에도 JSDoc은 다양한 상황에 맞는 타입 명시를 지원합니다. 이를 통해 자바스크립트 코드에서 타입 안전성을 유지하고, 코드의 가독성과 유지보수성을 높일 수 있습니다. JSDoc을 적극 활용하여 보다 명확하고 안정적인 코드를 작성할 수 있습니다.

### JSDoc의 한계점

- **타입 보장 부족**: JSDoc은 주석 기반이므로, 실제로 타입을 보장하지 않습니다. 타입스크립트처럼 컴파일 타임에 강력한 타입 검사를 제공하지 않기 때문에, 런타임 오류를 사전에 방지하는 데 한계가 있습니다.

- **IDE 의존성**: JSDoc의 많은 기능은 IDE나 코드 편집기의 지원에 크게 의존합니다. 잘 지원되지 않는 환경에서는 JSDoc이 제공하는 타입 정보나 자동 완성 기능을 제대로 활용할 수 없습니다.

- **문서와 코드의 동기화 문제**: JSDoc은 주석을 기반으로 하기 때문에, 코드가 변경될 때 주석이 업데이트되지 않으면 잘못된 정보를 제공할 수 있습니다. 이는 코드 유지보수에 어려움을 줄 수 있습니다.

- **복잡한 타입 처리의 한계**: JSDoc은 복잡한 타입이나 고급 타입 기능을 처리하는 데 한계가 있습니다. 예를 들어, 복잡한 제너릭, 고급 유니온 및 인터섹션 타입 등은 JSDoc에서 정확히 표현하기 어렵습니다.

- **타입스크립트와의 통합 부족**: JSDoc은 타입스크립트처럼 자바스크립트의 정적 타입 검사를 제공하지 않기 때문에, 타입 안정성을 필요로 하는 프로젝트에서는 타입스크립트에 비해 부족합니다. JSDoc은 단지 주석일 뿐, 타입스크립트처럼 코드의 일부로서 강력한 타입 보장을 제공하지 않습니다.
