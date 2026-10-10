// errors.ts
export class TokenRefreshingError extends Error {
  /** 서버가 내려준 원본 메시지 (예: "RT_MISSING") */
  readonly serverMessage: string | null;

  /** 실패 원인 분류 */
  readonly reason: RefreshingErrorReason;

  /** 원본 에러 (axios error 등) */
  readonly cause?: unknown;

  constructor(
    reason: RefreshingErrorReason,
    serverMessage: string | null = null,
    options?: { cause?: unknown },
  ) {
    super(`Refresh token failed: ${reason}`);
    this.name = "RefreshTokenError";
    this.reason = reason;
    this.serverMessage = serverMessage;
    this.cause = options?.cause;

    // ES5 타깃에서 instanceof가 깨지는 것 방지
    Object.setPrototypeOf(this, TokenRefreshingError.prototype);
  }
}

export type RefreshingErrorReason =
  | "RT_EXPIRED"            // RT 만료
  | "NO_TOKEN_IN_RESPONSE"  // 응답은 왔지만 토큰이 없음
  | "UNKNOWN";              // 그 외