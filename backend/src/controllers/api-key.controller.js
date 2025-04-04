import { ApiKey } from "../models/api-key.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { generateApiKey } from "../utils/apiKeyGenerator.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createApiKey = asyncHandler(async (req, res) => {
  const { userId, expiresAt } = req.body;

  if (!userId) throw new ApiError(400, "User ID is required");

  const user = await User.findById(userId);

  if (!user) throw new ApiError(404, "User not found");
  if (user.isBanned)
    throw new ApiError(403, "User is Banned from the platform!");

  if (expiresAt && new Date(expiresAt) <= new Date())
    throw new ApiError(400, "Expiration date must be in the future");

  const key = generateApiKey();

  const apiKey = new ApiKey({
    key,
    user: userId,
    expiresAt,
  });

  await apiKey.save();

  res
    .status(201)
    .json(new ApiResponse(201, apiKey, "API key created successfully"));
});

const activateApiKey = asyncHandler(async (req, res) => {
  const apiKeyId = req.params.id;

  if (!apiKeyId) throw new ApiError(400, "API key ID is required");

  const apiKey = await ApiKey.findById(apiKeyId);

  if (!apiKey) throw new ApiError(404, "API key not found");

  apiKey.isActive = true;
  await apiKey.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, "API key activated successfully"));
});

const deactivateApiKey = asyncHandler(async (req, res) => {
  const apiKeyId = req.params.id;

  if (!apiKeyId) throw new ApiError(400, "API key ID is required");

  const apiKey = await ApiKey.findById(apiKeyId);

  if (!apiKey) throw new ApiError(404, "API key not found");

  apiKey.isActive = false;
  await apiKey.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, "API key deactivated successfully"));
});

const getAllApiKeys = asyncHandler(async (req, res) => {
  const keys = await ApiKey.find({});
  res
    .status(200)
    .json(new ApiResponse(200, keys, "API keys retrieved successfully"));
});

const deleteApiKey = asyncHandler(async (req, res) => {
  const apiKeyId = req.params.id;

  if (!apiKeyId) throw new ApiError(400, "API key ID is required");

  const apiKey = await ApiKey.findByIdAndDelete(apiKeyId);

  if (!apiKey) throw new ApiError(404, "API key not found");

  res
    .status(200)
    .json(new ApiResponse(200, null, "API key deleted successfully"));
});

export {
  createApiKey,
  activateApiKey,
  deactivateApiKey,
  getAllApiKeys,
  deleteApiKey,
};
