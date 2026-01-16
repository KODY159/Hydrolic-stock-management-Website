import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'hydrolicwebsite',
  location: 'us-east4'
};

export const createComponentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateComponent', inputVars);
}
createComponentRef.operationName = 'CreateComponent';

export function createComponent(dcOrVars, vars) {
  return executeMutation(createComponentRef(dcOrVars, vars));
}

export const listEquipmentsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListEquipments');
}
listEquipmentsRef.operationName = 'ListEquipments';

export function listEquipments(dc) {
  return executeQuery(listEquipmentsRef(dc));
}

export const updateOrderNotesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateOrderNotes', inputVars);
}
updateOrderNotesRef.operationName = 'UpdateOrderNotes';

export function updateOrderNotes(dcOrVars, vars) {
  return executeMutation(updateOrderNotesRef(dcOrVars, vars));
}

export const getUserByEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserByEmail', inputVars);
}
getUserByEmailRef.operationName = 'GetUserByEmail';

export function getUserByEmail(dcOrVars, vars) {
  return executeQuery(getUserByEmailRef(dcOrVars, vars));
}

