enum OrderStatus { 
    CREATED,
    IN_PROGRESS,  
    COMPLETE, 
    FAILED 
};

enum UserScopes { 
    ADMIN = 'ADMIN', 
    USER = 'USER'
}; 

enum RoleTypes { 
    SUPERADMIN = 'SUPERADMIN',  
    SUPERVISOR = 'SUPERVISOR', 
    ADMIN = 'ADMIN', 
    USER =  'USER'
}; 

enum UserPermissionTypes { 
    VIEW_LISTING = 'VIEW_LISTING', 
    CREATE_LISTING = 'CREATE_LISTING', 
    EDIT_LISTING = 'EDIT_LISTING',
    VIEW_USERS = 'VIEW_USERS', 
    VIEW_ORDERS = 'VIEW_ORDERS',
    CREATE_ADMIN = 'CREATE_ADMIN', 
    EDIT_ADMIN = 'EDIT_ADMIN', 
    VIEW_ADMIN = 'VIEW_ADMIN', 
    ALL = 'ALL'  
};

export { OrderStatus, UserScopes, RoleTypes, UserPermissionTypes }; 