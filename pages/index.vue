<template>
	<ul class="flex flex-wrap justify-between items-start max-md:flex-col">
		<li v-for="item in list" class="w-82 rounded-lg overflow-hidden shadow-md hover:shadow-lg duration-200 max-md:w-full max-md:mb-4">
			<NuxtLink :to="item.url">
				<img :src="item.cover" :alt="item.cover" />
			</NuxtLink>
		</li>
	</ul>
</template>

<script lang="ts" setup>
const list = ref([
	{
		url: "/t/1",
		cover: "/cover/1.webp",
	}
]);
</script>
