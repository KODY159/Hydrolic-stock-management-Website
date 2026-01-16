const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'hydrolicwebsite',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createComponentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateComponent', inputVars);
}
createComponentRef.operationName = 'CreateComponent';
exports.createComponentRef = createComponentRef;

exports.createComponent = function createComponent(dcOrVars, vars) {
  return executeMutation(createComponentRef(dcOrVars, vars));
};

const listEquipmentsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListEquipments');
}
listEquipmentsRef.operationName = 'ListEquipments';
exports.listEquipmentsRef = listEquipmentsRef;

exports.listEquipments = function listEquipments(dc) {
  return executeQuery(listEquipmentsRef(dc));
};

const updateOrderNotesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateOrderNotes', inputVars);
}
updateOrderNotesRef.operationName = 'UpdateOrderNotes';
exports.updateOrderNotesRef = updateOrderNotesRef;

exports.updateOrderNotes = function updateOrderNotes(dcOrVars, vars) {
  return executeMutation(updateOrderNotesRef(dcOrVars, vars));
};

const getUserByEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserByEmail', inputVars);
}
getUserByEmailRef.operationName = 'GetUserByEmail';
exports.getUserByEmailRef = getUserByEmailRef;

exports.getUserByEmail = function getUserByEmail(dcOrVars, vars) {
  return executeQuery(getUserByEmailRef(dcOrVars, vars));
};
