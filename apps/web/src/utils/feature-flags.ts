export const mockFlags = {
  enableLogin: true,
  enableExplore: true,
  enableTracks: true,
  enableEarlyAccess: false,
  enableInChallengeTrack: true,
  enableHolidayEvent: true,
  enableAotPlatform: true,
};

export async function getAllFlags() {
  if (!process.env.FEATURE_FLAGS) {
    return mockFlags;
  }

  return {
    ...mockFlags,
    ...(JSON.parse(process.env.FEATURE_FLAGS) as Partial<typeof mockFlags>),
  };
}
