"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPermissionTypes = exports.RoleTypes = exports.UserScopes = exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus[OrderStatus["CREATED"] = 0] = "CREATED";
    OrderStatus[OrderStatus["IN_PROGRESS"] = 1] = "IN_PROGRESS";
    OrderStatus[OrderStatus["COMPLETE"] = 2] = "COMPLETE";
    OrderStatus[OrderStatus["FAILED"] = 3] = "FAILED";
})(OrderStatus || (OrderStatus = {}));
exports.OrderStatus = OrderStatus;
;
var UserScopes;
(function (UserScopes) {
    UserScopes["ADMIN"] = "ADMIN";
    UserScopes["USER"] = "USER";
})(UserScopes || (UserScopes = {}));
exports.UserScopes = UserScopes;
;
var RoleTypes;
(function (RoleTypes) {
    RoleTypes["SUPERADMIN"] = "SUPERADMIN";
    RoleTypes["SUPERVISOR"] = "SUPERVISOR";
    RoleTypes["ADMIN"] = "ADMIN";
    RoleTypes["USER"] = "USER";
})(RoleTypes || (RoleTypes = {}));
exports.RoleTypes = RoleTypes;
;
var UserPermissionTypes;
(function (UserPermissionTypes) {
    UserPermissionTypes["VIEW_LISTING"] = "VIEW_LISTING";
    UserPermissionTypes["CREATE_LISTING"] = "CREATE_LISTING";
    UserPermissionTypes["EDIT_LISTING"] = "EDIT_LISTING";
    UserPermissionTypes["VIEW_USERS"] = "VIEW_USERS";
    UserPermissionTypes["VIEW_ORDERS"] = "VIEW_ORDERS";
    UserPermissionTypes["CREATE_ADMIN"] = "CREATE_ADMIN";
    UserPermissionTypes["EDIT_ADMIN"] = "EDIT_ADMIN";
    UserPermissionTypes["VIEW_ADMIN"] = "VIEW_ADMIN";
    UserPermissionTypes["ALL"] = "ALL";
})(UserPermissionTypes || (UserPermissionTypes = {}));
exports.UserPermissionTypes = UserPermissionTypes;
;
