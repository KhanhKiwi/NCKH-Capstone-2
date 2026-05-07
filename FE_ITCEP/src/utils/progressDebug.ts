/**
 * Debug Helper for Progress System
 * Use this to diagnose unlock issues
 */

import { progressService } from '../api/services/progressService';

export async function debugProgressSystem() {
  console.clear();
  console.log('=== PROGRESS SYSTEM DEBUG ===\n');

  // 1. Check user data
  console.log('1️⃣ Checking User Data...');
  const userData = localStorage.getItem('user');
  if (!userData) {
    console.error('❌ No user data in localStorage');
    return;
  }
  
  let userId: number | null = null;
  try {
    const user = JSON.parse(userData);
    userId = user.id || user.user_id;
    console.log('✅ User found:', { id: userId, name: user.name });
  } catch (e) {
    console.error('❌ Failed to parse user data:', e);
    return;
  }

  // 2. Check authentication
  console.log('\n2️⃣ Checking Authentication...');
  const token = localStorage.getItem('access_token');
  if (!token) {
    console.error('❌ No access token found');
  } else {
    console.log('✅ Token found:', token.substring(0, 20) + '...');
  }

  // 3. Try to fetch user progress
  console.log('\n3️⃣ Fetching User Progress...');
  try {
    const progress = await progressService.getUserProgress(userId);
    if (progress.length === 0) {
      console.log('⚠️  No progress found (empty array)');
      console.log('   This means level 1 will be auto-initialized on next modal open');
    } else {
      console.log(`✅ Found ${progress.length} progress records:`);
      progress.forEach((p, i) => {
        console.log(`   ${i + 1}. Level ${p.level?.level_id} - ${p.level?.difficulty} - Status: ${p.status}`);
      });
    }
  } catch (error) {
    console.error('❌ Failed to fetch progress:', error);
    return;
  }

  // 4. Try to initialize level 1
  console.log('\n4️⃣ Testing Level 1 Initialization...');
  try {
    const result = await progressService.saveProgress({
      user_id: userId,
      level_id: 7,
      status: 'unlocked'
    });
    console.log('✅ Level 1 initialization successful:', result);

    // Verify
    const updated = await progressService.getUserProgress(userId);
    console.log('✅ Verified:', updated.length, 'progress records now');
  } catch (error) {
    console.error('❌ Failed to initialize level:', error);
    if (error instanceof Error) {
      console.error('   Error message:', error.message);
    }
  }

  console.log('\n=== END DEBUG ===\n');
}

// Export for use in browser console
(window as any).debugProgress = debugProgressSystem;

console.log('💡 Debug helper loaded. Run debugProgress() in console to diagnose issues.');
