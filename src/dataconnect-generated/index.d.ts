import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Component_Key {
  id: UUIDString;
  __typename?: 'Component_Key';
}

export interface CreateComponentData {
  component_insert: Component_Key;
}

export interface CreateComponentVariables {
  name: string;
  partNumber: string;
  quantity: number;
  unitOfMeasure: string;
}

export interface Equipment_Key {
  id: UUIDString;
  __typename?: 'Equipment_Key';
}

export interface GetUserByEmailData {
  users: ({
    id: UUIDString;
    username: string;
    email: string;
    displayName?: string | null;
  } & User_Key)[];
}

export interface GetUserByEmailVariables {
  email: string;
}

export interface ListEquipmentsData {
  equipments: ({
    id: UUIDString;
    name: string;
    location: string;
  } & Equipment_Key)[];
}

export interface OrderLineItem_Key {
  orderId: UUIDString;
  componentId: UUIDString;
  __typename?: 'OrderLineItem_Key';
}

export interface Order_Key {
  id: UUIDString;
  __typename?: 'Order_Key';
}

export interface UpdateOrderNotesData {
  order_update?: Order_Key | null;
}

export interface UpdateOrderNotesVariables {
  id: UUIDString;
  notes?: string | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateComponentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateComponentVariables): MutationRef<CreateComponentData, CreateComponentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateComponentVariables): MutationRef<CreateComponentData, CreateComponentVariables>;
  operationName: string;
}
export const createComponentRef: CreateComponentRef;

export function createComponent(vars: CreateComponentVariables): MutationPromise<CreateComponentData, CreateComponentVariables>;
export function createComponent(dc: DataConnect, vars: CreateComponentVariables): MutationPromise<CreateComponentData, CreateComponentVariables>;

interface ListEquipmentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListEquipmentsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListEquipmentsData, undefined>;
  operationName: string;
}
export const listEquipmentsRef: ListEquipmentsRef;

export function listEquipments(): QueryPromise<ListEquipmentsData, undefined>;
export function listEquipments(dc: DataConnect): QueryPromise<ListEquipmentsData, undefined>;

interface UpdateOrderNotesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrderNotesVariables): MutationRef<UpdateOrderNotesData, UpdateOrderNotesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateOrderNotesVariables): MutationRef<UpdateOrderNotesData, UpdateOrderNotesVariables>;
  operationName: string;
}
export const updateOrderNotesRef: UpdateOrderNotesRef;

export function updateOrderNotes(vars: UpdateOrderNotesVariables): MutationPromise<UpdateOrderNotesData, UpdateOrderNotesVariables>;
export function updateOrderNotes(dc: DataConnect, vars: UpdateOrderNotesVariables): MutationPromise<UpdateOrderNotesData, UpdateOrderNotesVariables>;

interface GetUserByEmailRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
  operationName: string;
}
export const getUserByEmailRef: GetUserByEmailRef;

export function getUserByEmail(vars: GetUserByEmailVariables): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;
export function getUserByEmail(dc: DataConnect, vars: GetUserByEmailVariables): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;

