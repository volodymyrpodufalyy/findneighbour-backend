/**
 * @swagger
 * components:
 *   schemas:
 *     AdditionalInfo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The user ID.
 *           example: 1
 *         age:
 *           type: number
 *           description: The user's age.
 *           example: 45
 *         address:
 *           type: string
 *           description: The user's address.
 *           example: Lviv, Shevchenka street 5
 *         sex:
 *           type: string
 *           description: The user's sex.
 *           example: male
 *         hasPets:
 *           type: boolean
 *           description: The user has pets or not.
 *           example: false
 *         hasBadHabits:
 *           type: boolean
 *           description: The user has Bad Habits or not.
 *           example: false
 *         isStudent:
 *           type: boolean
 *           description:  The user is student or not.
 *           example: true
 *         hasJob:
 *           type: boolean
 *           description: The user has Job or not.
 *           example: true
 *         isMarried:
 *           type: boolean
 *           description: The user is Married or not.
 *           example: true
 *         phoneNumber:
 *           type: string
 *           description: The user's phoneNumber .
 *           example: true
 *         moreAbout:
 *           type: string
 *           description: The user's description about himself.
 *           example: 'I like coffee and noisy parties'
 *         createdAt:
 *           type: Date
 *           description: The user's info createdAt date.
 *           example: 2021-11-14T13:54:28.861Z
 *         updatedAt:
 *           type: Date
 *           description: The user's info updatedAt date.
 *           example: 2021-11-14T13:54:28.861Z
 *         user:
 *           type: object
 *           description: The user's ref.
 *           example:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
