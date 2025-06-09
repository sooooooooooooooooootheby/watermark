<template>
	<Popover>
		<PopoverTrigger>
			<div :style="{ backgroundColor: rgba }" class="size-9 rounded-md"></div>
		</PopoverTrigger>
		<PopoverContent>
			<h1 class="mb-2 text-xl font-bold">Color sorter</h1>
			<label for="r" class="flex">
				<span class="mr-2">R</span>
				<Slider v-model="red" :max="255" :step="1" id="r" />
			</label>
			<label for="g" class="flex">
				<span class="mr-2">G</span>
				<Slider v-model="green" :max="255" :step="1" id="g" />
			</label>
			<label for="b" class="flex">
				<span class="mr-2">B</span>
				<Slider v-model="blue" :max="255" :step="1" id="b" />
			</label>
			<label for="a" class="flex">
				<span class="mr-2">A</span>
				<Slider v-model="alpha" :max="1" :step="0.1" id="a" />
			</label>
			<Input type="text" v-model="rgba" :placeholder="rgba" class="mt-2" />
		</PopoverContent>
	</Popover>
</template>

<script lang="ts" setup>
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "~/components/ui/input";

const props = defineProps({
	modelValue: {
		type: String,
		default: "rgba(0,0,0,1)",
	},
});
const emit = defineEmits(["update:modelValue"]);

const [r, g, b, a] = props.modelValue.match(/[\d.]+/g)?.map(Number) || [0, 0, 0, 1];
const red = ref([r]);
const green = ref([g]);
const blue = ref([b]);
const alpha = ref([a]);

const rgba = computed({
	get: () => `rgba(${red.value[0]}, ${green.value[0]}, ${blue.value[0]}, ${alpha.value[0]})`,
	set: (val: string) => {
		const match = val.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]*)\)/);
		if (match) {
			red.value[0] = Number(match[1]);
			green.value[0] = Number(match[2]);
			blue.value[0] = Number(match[3]);
			alpha.value[0] = match[4] !== "" ? Number(match[4]) : 1;
		}
	}
});

watch(rgba, (newVal) => {
	emit("update:modelValue", newVal);
});
</script>

<style scoped></style>
