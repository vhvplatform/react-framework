import React from 'react';
import { useCrud, CrudTable } from '@longvhv/crud';
import { Button, Card, Input, Modal } from '@longvhv/ui-components';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const App: React.FC = () => {
  const crud = useCrud<User>({ 
    resource: 'users',
    autoFetch: true,
  });
  
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: '', email: '', role: 'user' });

  const handleCreate = async () => {
    await crud.create(formData);
    setIsModalOpen(false);
    setFormData({ name: '', email: '', role: 'user' });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
            <Button onClick={() => setIsModalOpen(true)}>
              Add User
            </Button>
          </div>

          <CrudTable
            data={crud.items}
            loading={crud.loading}
            config={{
              columns: [
                { key: 'id', label: 'ID', sortable: true },
                { key: 'name', label: 'Name', sortable: true },
                { key: 'email', label: 'Email', sortable: true },
                { key: 'role', label: 'Role' },
              ],
              actions: {
                edit: true,
                delete: true,
                view: true,
              },
            }}
            onEdit={(user) => crud.setItem(user)}
            onDelete={(user) => crud.remove(user.id)}
          />

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Add New User"
          >
            <div className="space-y-4">
              <Input
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label="Role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate}>
                  Create
                </Button>
              </div>
            </div>
          </Modal>
        </Card>
      </div>
    </div>
  );
};

export default App;
