"use client";

import { Box, Heading, Text, Stack } from "@chakra-ui/react";
import { useAuth } from "@/lib/client/useAuth";
import QuickStatsCard from "@/components/dashboard/QuickStatsCard";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <Box>
      <Stack gap={6}>
        <Box>
          <Heading size="xl">
            Welcome back{user?.fullName ? `, ${user.fullName}` : ""}!
          </Heading>
          <Text color="gray.600" mt={2}>
            Manage your contacts and settings from this dashboard.
          </Text>
        </Box>

        <Box>
          <Heading size="md" mb={4}>
            Quick Stats
          </Heading>
          <QuickStatsCard />
        </Box>
      </Stack>
    </Box>
  );
}
