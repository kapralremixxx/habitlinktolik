import React from 'react';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';

export default function Dashboard() {
  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        HabitLink Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Placeholder cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} style={{ padding: '1rem' }}>
            <Typography variant="h6">Users</Typography>
            <Typography variant="h3">0</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} style={{ padding: '1rem' }}>
            <Typography variant="h6">Active Subscriptions</Typography>
            <Typography variant="h3">0</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} style={{ padding: '1rem' }}>
            <Typography variant="h6">MRR</Typography>
            <Typography variant="h3">$0</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} style={{ padding: '1rem' }}>
            <Typography variant="h6">DAU / MAU</Typography>
            <Typography variant="h3">0 / 0</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
