module.exports = {
    transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
    },
    // Limpia la BD UNA VEZ al principio de todo.
    globalSetup:    './e2e/test-setup.ts',   
    
    // Cierra la conexión a la BD UNA VEZ al final de todo.
    globalTeardown:     './e2e/teardown.ts',
    
    testEnvironment: 'node'
};
   