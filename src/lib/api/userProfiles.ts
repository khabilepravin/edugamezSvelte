/**
 * User Profiles API Integration
 * This file contains API calls for user profile management
 */

// User profile interfaces
export interface UserProfileRequest {
  userId: string;
  userRole: string;
  displayName: string;
  userSubscriptionLevel: string;
}

export interface UserProfileResponse {
  success: boolean;
  data?: UserProfile | any;
  message?: string;
  error?: string;
}

// User profile data structure returned from API
export interface UserProfile {
  userId: string;
  userRole: string;
  displayName: string;
  userSubscriptionLevel: string;
  // Add other profile fields as needed
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Create or update user profile by user ID
 * @param profileData - User profile data to send
 * @param authToken - Optional authentication token
 * @returns Promise containing the user profile response
 */
export async function createUserProfileByUserId(
  profileData: UserProfileRequest,
  authToken?: string
): Promise<UserProfileResponse> {
  try {
    // Use environment variable for API base URL or fallback to localhost
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7146';
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'text/plain'
    };

    // Add authorization header if token is provided
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${apiBaseUrl}/api/v1/UserProfiles/byuserid`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        userId: profileData.userId,
        userRole: profileData.userRole,
        displayName: profileData.displayName,
        userSubscriptionLevel: profileData.userSubscriptionLevel
      })
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.text();
        if (errorData) {
          errorMessage = errorData;
        }
      } catch (parseError) {
        // If we can't parse the error response, use the default message
      }

      throw new Error(errorMessage);
    }

    const data = await response.text();
    
    return {
      success: true,
      data: data || null,
      message: 'User profile created/updated successfully'
    };

  } catch (error) {
    console.error('Error creating user profile:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Get user profile by user ID
 * @param userId - User ID to retrieve profile for
 * @param authToken - Optional authentication token
 * @returns Promise containing the user profile response
 */
export async function getUserProfileByUserId(
  userId: string,
  authToken?: string
): Promise<UserProfileResponse> {
  try {
    // Use environment variable for API base URL or fallback to localhost
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7146';
    
    const headers: Record<string, string> = {
      'Accept': 'application/json'
    };

    // Add authorization header if token is provided
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${apiBaseUrl}/api/v1/UserProfiles/byuserid/${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.text();
        if (errorData) {
          errorMessage = errorData;
        }
      } catch (parseError) {
        // If we can't parse the error response, use the default message
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data,
      message: 'User profile retrieved successfully'
    };

  } catch (error) {
    console.error('Error retrieving user profile:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Validate user profile data before sending to API
 * @param profileData - User profile data to validate
 * @returns Object containing validation result and error messages
 */
export function validateUserProfileData(profileData: Partial<UserProfileRequest>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!profileData.userId || profileData.userId.trim() === '') {
    errors.push('User ID is required');
  }

  if (!profileData.userRole || profileData.userRole.trim() === '') {
    errors.push('User role is required');
  }

  if (!profileData.displayName || profileData.displayName.trim() === '') {
    errors.push('Display name is required');
  }

  if (!profileData.userSubscriptionLevel || profileData.userSubscriptionLevel.trim() === '') {
    errors.push('User subscription level is required');
  }

  // Validate UUID format for userId (basic validation)
  if (profileData.userId && !isValidUUID(profileData.userId)) {
    errors.push('User ID must be a valid UUID format');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Check if a string is a valid UUID format
 * @param uuid - String to validate
 * @returns boolean indicating if the string is a valid UUID
 */
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Create user profile data object with default values
 * @param userId - Required user ID
 * @param overrides - Optional overrides for other fields
 * @returns UserProfileRequest object with defaults
 */
export function createUserProfileData(
  userId: string,
  overrides: Partial<Omit<UserProfileRequest, 'userId'>> = {}
): UserProfileRequest {
  return {
    userId,
    userRole: overrides.userRole || 'student',
    displayName: overrides.displayName || 'User',
    userSubscriptionLevel: overrides.userSubscriptionLevel || 'free'
  };
}
