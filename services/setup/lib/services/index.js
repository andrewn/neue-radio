const { join } = require('path');
const fs = require('../fs');

const services = ({ path, available }) => {
  const current = async () => {
    try {
      const files = await fs.readDir(path);

      return files;
    } catch(err) {
      console.error('services read error:', err);

      return [];
    }
  };

  const status = async () => {
    const activeServices = await current();
    const availableServices = await available();

    return availableServices.map(p => ({
      name: p,
      active: activeServices.includes(p),
    }));
  };

  const set = async (paths = []) => {
    const existing = await current();

    const pendingDelete = existing.filter(p => (
      !paths.includes(p)
    ));

    const pendingCreate = paths.filter(p => (
      !existing.includes(p)
    ));

    pendingDelete.forEach(async (p) => {
      const fullPath = join(path, p);
      await fs.unlink(fullPath);
    });

    pendingCreate.forEach(async (p) => {
      const fullPath = join(path, p);
      await fs.open(fullPath, 'w');
    });
  };

  return { set, status };
};

module.exports = services;
