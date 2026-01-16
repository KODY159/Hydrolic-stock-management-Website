# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListEquipments*](#listequipments)
  - [*GetUserByEmail*](#getuserbyemail)
- [**Mutations**](#mutations)
  - [*CreateComponent*](#createcomponent)
  - [*UpdateOrderNotes*](#updateordernotes)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListEquipments
You can execute the `ListEquipments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listEquipments(): QueryPromise<ListEquipmentsData, undefined>;

interface ListEquipmentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListEquipmentsData, undefined>;
}
export const listEquipmentsRef: ListEquipmentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listEquipments(dc: DataConnect): QueryPromise<ListEquipmentsData, undefined>;

interface ListEquipmentsRef {
  ...
  (dc: DataConnect): QueryRef<ListEquipmentsData, undefined>;
}
export const listEquipmentsRef: ListEquipmentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listEquipmentsRef:
```typescript
const name = listEquipmentsRef.operationName;
console.log(name);
```

### Variables
The `ListEquipments` query has no variables.
### Return Type
Recall that executing the `ListEquipments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListEquipmentsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListEquipmentsData {
  equipments: ({
    id: UUIDString;
    name: string;
    location: string;
  } & Equipment_Key)[];
}
```
### Using `ListEquipments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listEquipments } from '@dataconnect/generated';


// Call the `listEquipments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listEquipments();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listEquipments(dataConnect);

console.log(data.equipments);

// Or, you can use the `Promise` API.
listEquipments().then((response) => {
  const data = response.data;
  console.log(data.equipments);
});
```

### Using `ListEquipments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listEquipmentsRef } from '@dataconnect/generated';


// Call the `listEquipmentsRef()` function to get a reference to the query.
const ref = listEquipmentsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listEquipmentsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.equipments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.equipments);
});
```

## GetUserByEmail
You can execute the `GetUserByEmail` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserByEmail(vars: GetUserByEmailVariables): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;

interface GetUserByEmailRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
}
export const getUserByEmailRef: GetUserByEmailRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserByEmail(dc: DataConnect, vars: GetUserByEmailVariables): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;

interface GetUserByEmailRef {
  ...
  (dc: DataConnect, vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
}
export const getUserByEmailRef: GetUserByEmailRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserByEmailRef:
```typescript
const name = getUserByEmailRef.operationName;
console.log(name);
```

### Variables
The `GetUserByEmail` query requires an argument of type `GetUserByEmailVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserByEmailVariables {
  email: string;
}
```
### Return Type
Recall that executing the `GetUserByEmail` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserByEmailData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserByEmailData {
  users: ({
    id: UUIDString;
    username: string;
    email: string;
    displayName?: string | null;
  } & User_Key)[];
}
```
### Using `GetUserByEmail`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserByEmail, GetUserByEmailVariables } from '@dataconnect/generated';

// The `GetUserByEmail` query requires an argument of type `GetUserByEmailVariables`:
const getUserByEmailVars: GetUserByEmailVariables = {
  email: ..., 
};

// Call the `getUserByEmail()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserByEmail(getUserByEmailVars);
// Variables can be defined inline as well.
const { data } = await getUserByEmail({ email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserByEmail(dataConnect, getUserByEmailVars);

console.log(data.users);

// Or, you can use the `Promise` API.
getUserByEmail(getUserByEmailVars).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `GetUserByEmail`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserByEmailRef, GetUserByEmailVariables } from '@dataconnect/generated';

// The `GetUserByEmail` query requires an argument of type `GetUserByEmailVariables`:
const getUserByEmailVars: GetUserByEmailVariables = {
  email: ..., 
};

// Call the `getUserByEmailRef()` function to get a reference to the query.
const ref = getUserByEmailRef(getUserByEmailVars);
// Variables can be defined inline as well.
const ref = getUserByEmailRef({ email: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserByEmailRef(dataConnect, getUserByEmailVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateComponent
You can execute the `CreateComponent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createComponent(vars: CreateComponentVariables): MutationPromise<CreateComponentData, CreateComponentVariables>;

interface CreateComponentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateComponentVariables): MutationRef<CreateComponentData, CreateComponentVariables>;
}
export const createComponentRef: CreateComponentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createComponent(dc: DataConnect, vars: CreateComponentVariables): MutationPromise<CreateComponentData, CreateComponentVariables>;

interface CreateComponentRef {
  ...
  (dc: DataConnect, vars: CreateComponentVariables): MutationRef<CreateComponentData, CreateComponentVariables>;
}
export const createComponentRef: CreateComponentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createComponentRef:
```typescript
const name = createComponentRef.operationName;
console.log(name);
```

### Variables
The `CreateComponent` mutation requires an argument of type `CreateComponentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateComponentVariables {
  name: string;
  partNumber: string;
  quantity: number;
  unitOfMeasure: string;
}
```
### Return Type
Recall that executing the `CreateComponent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateComponentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateComponentData {
  component_insert: Component_Key;
}
```
### Using `CreateComponent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createComponent, CreateComponentVariables } from '@dataconnect/generated';

// The `CreateComponent` mutation requires an argument of type `CreateComponentVariables`:
const createComponentVars: CreateComponentVariables = {
  name: ..., 
  partNumber: ..., 
  quantity: ..., 
  unitOfMeasure: ..., 
};

// Call the `createComponent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createComponent(createComponentVars);
// Variables can be defined inline as well.
const { data } = await createComponent({ name: ..., partNumber: ..., quantity: ..., unitOfMeasure: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createComponent(dataConnect, createComponentVars);

console.log(data.component_insert);

// Or, you can use the `Promise` API.
createComponent(createComponentVars).then((response) => {
  const data = response.data;
  console.log(data.component_insert);
});
```

### Using `CreateComponent`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createComponentRef, CreateComponentVariables } from '@dataconnect/generated';

// The `CreateComponent` mutation requires an argument of type `CreateComponentVariables`:
const createComponentVars: CreateComponentVariables = {
  name: ..., 
  partNumber: ..., 
  quantity: ..., 
  unitOfMeasure: ..., 
};

// Call the `createComponentRef()` function to get a reference to the mutation.
const ref = createComponentRef(createComponentVars);
// Variables can be defined inline as well.
const ref = createComponentRef({ name: ..., partNumber: ..., quantity: ..., unitOfMeasure: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createComponentRef(dataConnect, createComponentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.component_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.component_insert);
});
```

## UpdateOrderNotes
You can execute the `UpdateOrderNotes` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateOrderNotes(vars: UpdateOrderNotesVariables): MutationPromise<UpdateOrderNotesData, UpdateOrderNotesVariables>;

interface UpdateOrderNotesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrderNotesVariables): MutationRef<UpdateOrderNotesData, UpdateOrderNotesVariables>;
}
export const updateOrderNotesRef: UpdateOrderNotesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateOrderNotes(dc: DataConnect, vars: UpdateOrderNotesVariables): MutationPromise<UpdateOrderNotesData, UpdateOrderNotesVariables>;

interface UpdateOrderNotesRef {
  ...
  (dc: DataConnect, vars: UpdateOrderNotesVariables): MutationRef<UpdateOrderNotesData, UpdateOrderNotesVariables>;
}
export const updateOrderNotesRef: UpdateOrderNotesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateOrderNotesRef:
```typescript
const name = updateOrderNotesRef.operationName;
console.log(name);
```

### Variables
The `UpdateOrderNotes` mutation requires an argument of type `UpdateOrderNotesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateOrderNotesVariables {
  id: UUIDString;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `UpdateOrderNotes` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateOrderNotesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateOrderNotesData {
  order_update?: Order_Key | null;
}
```
### Using `UpdateOrderNotes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateOrderNotes, UpdateOrderNotesVariables } from '@dataconnect/generated';

// The `UpdateOrderNotes` mutation requires an argument of type `UpdateOrderNotesVariables`:
const updateOrderNotesVars: UpdateOrderNotesVariables = {
  id: ..., 
  notes: ..., // optional
};

// Call the `updateOrderNotes()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateOrderNotes(updateOrderNotesVars);
// Variables can be defined inline as well.
const { data } = await updateOrderNotes({ id: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateOrderNotes(dataConnect, updateOrderNotesVars);

console.log(data.order_update);

// Or, you can use the `Promise` API.
updateOrderNotes(updateOrderNotesVars).then((response) => {
  const data = response.data;
  console.log(data.order_update);
});
```

### Using `UpdateOrderNotes`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateOrderNotesRef, UpdateOrderNotesVariables } from '@dataconnect/generated';

// The `UpdateOrderNotes` mutation requires an argument of type `UpdateOrderNotesVariables`:
const updateOrderNotesVars: UpdateOrderNotesVariables = {
  id: ..., 
  notes: ..., // optional
};

// Call the `updateOrderNotesRef()` function to get a reference to the mutation.
const ref = updateOrderNotesRef(updateOrderNotesVars);
// Variables can be defined inline as well.
const ref = updateOrderNotesRef({ id: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateOrderNotesRef(dataConnect, updateOrderNotesVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.order_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.order_update);
});
```

