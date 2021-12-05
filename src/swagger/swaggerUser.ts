/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The user ID.
 *           example: 1
 *         fullname:
 *           type: string
 *           description: The user's fullname.
 *           example: Leanne Graham
 *         email:
 *           type: string
 *           description: The user's email.
 *           example: bohdan12@gmail.com
 *         password:
 *           type: string
 *           description: The user's hashed password.
 *           example: $2b$10$6R1FvPx9Bh8WIdcHURIcBemeAQ8tRnnv9kFvzlztLnuY6bM89t072
 *         confirmed:
 *           type: boolean
 *           description: The user's confirmed email status.
 *           example: false
 *         confirm_hash:
 *           type: string
 *           description: The user's hash confirmed.
 *           example: $2b$10$DeNjSUHM38kWuGDWbNlYlu5GcBcGE.jlE6j2dzR2tG3jckh1SBX5q
 *         last_seen:
 *           type: Date
 *           description: The user's last seen date.
 *           example: 2021-11-14T13:54:28.861Z
 *         createdAt:
 *           type: Date
 *           description: The user's createdAt date.
 *           example: 2021-11-14T13:54:28.861Z
 *         updatedAt:
 *           type: Date
 *           description: The user's updatedAt date.
 *           example: 2021-11-14T13:54:28.861Z
 */
