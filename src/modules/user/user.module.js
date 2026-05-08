import { UserRepository } from './user.repository.js';
import { UserService } from './user.service.js';
import UserController from './user.controller.js';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

export { userController };
