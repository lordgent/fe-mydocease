const MESSAGES = {
AUTH: {
  INVALID: { status: 'error', code: 'auth_invalid', message: 'Invalid email or password.' },
  INACTIVE: { status: 'error', code: 'auth_inactive', message: 'Your account is not active yet. Check your email to verify.' },
  SUCCESS: { status: 'success', code: 'auth_success', message: 'Login successful. Welcome back!' },
  ATTEMPTS: { status: 'warning', code: 'auth_attempts', message: 'Too many login attempts. Please try again later.' },
  TOKEN_EXPIRED: { status: 'error', code: 'auth_token_expired', message: 'Your login session expired. Please log in again.' },
  EMAIL_VERIFIED: { status: 'success', code: 'auth_email_verified', message: 'Your email has been verified successfully. You can now log in.' },
  FORGOT_REQUEST: { status: 'info', code: 'auth_forgot_request', message: 'We sent you an email with a link to reset your password.' },
  FORGOT_TOKEN_EXPIRED: { status: 'error', code: 'auth_forgot_token_expired', message: 'Reset link expired. Please request a new one.' },
  FORGOT_SUCCESS: { status: 'success', code: 'auth_forgot_success', message: 'Your password has been reset successfully. You can now log in.' },
  FORGOT_PASSWORD_MISMATCH: { status: 'error', code: 'auth_forgot_password_mismatch', message: 'Password and confirmation do not match. Please try again.' },
},

  SUBSCRIPTION: {
    NONE: { status: 'error', code: 'subscription_none', message: 'You don’t have an active subscription.' },
    EXPIRED: { status: 'error', code: 'subscription_expired', message: 'Your subscription has ended. Please renew to continue.' },
    ACTIVE: (date) => ({ status: 'success', code: 'subscription_active', message: `Your subscription is active until ${date}.` }),
    TRIAL: { status: 'info', code: 'subscription_trial', message: 'You are using a trial version.' },
  },

  UPLOAD: {
    MISSING: { status: 'error', code: 'upload_missing', message: 'No file found. Please select a file to upload.' },
    INVALID_FORMAT: (allowed) => ({ status: 'error', code: 'upload_invalid_format', message: `Invalid file format. Allowed: ${allowed.join(', ')}.` }),
    TOO_LARGE: (maxSize) => ({ status: 'error', code: 'upload_too_large', message: `File is too large. Maximum allowed size: ${maxSize} MB.` }),
    SUCCESS: { status: 'success', code: 'upload_success', message: 'File uploaded successfully.' },
    PARTIAL: { status: 'warning', code: 'upload_partial', message: 'Some files failed to upload. Please check.' },
  },

  PROCESS: {
    COMPLETE: { status: 'success', code: 'process_complete', message: 'File processed successfully.' },
    FAILED: { status: 'error', code: 'process_failed', message: 'Something went wrong while processing the file. Try again.' },
    MERGE_FAILED: { status: 'error', code: 'process_merge_failed', message: 'Could not merge files. Make sure all PDFs are valid.' },
    WORD_FAILED: { status: 'error', code: 'process_word_failed', message: 'Failed to convert Word to PDF. Check the source file.' },
    PENDING: { status: 'info', code: 'process_pending', message: 'File is being processed. Hang tight!' },
    PARTIAL: { status: 'warning', code: 'process_partial', message: 'Some pages/files failed to process.' },
  },

  SYSTEM: {
    DOWNLOAD_ERROR: {
      status: 'error',
      code: 'server_error',
      message: 'Failed to download the file due to a server error. Please try again later.'
    },
    SERVER_ERROR: { status: 'error', code: 'server_error', message: 'Oops! Something went wrong on our side. Try again later.' },
    FILE_NOT_FOUND: { status: 'error', code: 'file_not_found', message: 'File not found on the server.' },
    INVALID_REQUEST: { status: 'error', code: 'invalid_request', message: 'Invalid request. Check your input and try again.' },
    MAINTENANCE: { status: 'info', code: 'maintenance', message: 'System is under maintenance. Some features may be unavailable.' },
    DEPRECATED: { status: 'warning', code: 'deprecated', message: 'This feature is outdated and will be removed in future updates.' },
  },
};

export default MESSAGES;
