<template>
    <div id="app22">
        <router-view></router-view>
    </div>
</template>

<script>
    export default{
      name: 'APP'
    }
</script>

<style>
	/*全局覆盖默认的loading样式*/
	.el-loading-mask{
		background: rgba(0,0,0,.5);
	}
    input[readonly]{
        background-color: #eef1f6;
        border-color: #d1dbe5;
        color: #bbb;
        cursor: not-allowed;
    }
</style>
