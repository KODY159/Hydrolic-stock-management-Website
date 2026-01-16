# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createComponent, listEquipments, updateOrderNotes, getUserByEmail } from '@dataconnect/generated';


// Operation CreateComponent:  For variables, look at type CreateComponentVars in ../index.d.ts
const { data } = await CreateComponent(dataConnect, createComponentVars);

// Operation ListEquipments: 
const { data } = await ListEquipments(dataConnect);

// Operation UpdateOrderNotes:  For variables, look at type UpdateOrderNotesVars in ../index.d.ts
const { data } = await UpdateOrderNotes(dataConnect, updateOrderNotesVars);

// Operation GetUserByEmail:  For variables, look at type GetUserByEmailVars in ../index.d.ts
const { data } = await GetUserByEmail(dataConnect, getUserByEmailVars);


```